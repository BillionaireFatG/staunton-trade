'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Document } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DocumentsSectionProps {
  dealId: string;
  initialDocuments: Document[];
}

export default function DocumentsSection({ dealId, initialDocuments }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const documentTypes = [
    'Contract',
    'Invoice',
    'LC',
    'Inspection Certificate',
    'Bill of Lading',
  ];

  const refreshDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('deal_id', dealId)
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setError('Please select a file and document type');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${dealId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, selectedFile);

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('documents')
        .insert([
          {
            deal_id: dealId,
            document_type: documentType,
            file_name: selectedFile.name,
            file_url: publicUrl,
          },
        ]);

      if (insertError) {
        setError(insertError.message);
        setUploading(false);
        return;
      }

      setSuccess('Document uploaded successfully');
      setSelectedFile(null);
      setDocumentType('');
      await refreshDocuments();

      setTimeout(() => {
        setShowUploadModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError('An unexpected error occurred');
      setUploading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const filePath = doc.file_url.split('/').slice(-2).join('/');
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Error creating signed URL:', error);
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-6">
      <Card className="bg-[#111111] border-gray-800 rounded-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Documents</h3>
              <p className="text-sm text-[#a3a3a3]">Manage deal-related documents and files</p>
            </div>
            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
              <DialogTrigger asChild>
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111111] border-gray-800 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {error && (
                    <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-md text-sm text-[#ef4444]">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/20 rounded-md text-sm text-[#10b981]">
                      {success}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="file-input" className="text-sm font-normal text-[#a3a3a3]">
                      Select PDF File <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Input
                      id="file-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="bg-[#0a0a0a] border-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-normal file:bg-[#111111] file:text-white hover:file:bg-[#111111]"
                    />
                    {selectedFile && (
                      <p className="text-sm text-[#a3a3a3] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document-type" className="text-sm font-normal text-[#a3a3a3]">
                      Document Type <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
                      <SelectTrigger className="bg-[#0a0a0a] border-gray-800 text-white">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-gray-800">
                        {documentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-4 justify-end pt-4 border-t border-gray-800">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowUploadModal(false);
                        setError(null);
                        setSuccess(null);
                        setSelectedFile(null);
                        setDocumentType('');
                      }}
                      disabled={uploading}
                      className="text-[#a3a3a3] hover:text-white hover:bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile || !documentType}
                      className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {documents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-[#0a0a0a] border border-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#737373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-[#a3a3a3] mb-2">No documents uploaded yet</p>
              <p className="text-xs text-[#737373]">Upload contracts, invoices, and other deal documents</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-[#737373] uppercase">Document Name</TableHead>
                  <TableHead className="text-xs font-semibold text-[#737373] uppercase">Type</TableHead>
                  <TableHead className="text-xs font-semibold text-[#737373] uppercase">Upload Date</TableHead>
                  <TableHead className="text-xs font-semibold text-[#737373] uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow 
                    key={doc.id} 
                    className={`border-gray-800 hover:bg-[#0a0a0a] ${index % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#111111]'}`}
                  >
                    <TableCell className="text-sm font-medium text-white">{doc.file_name}</TableCell>
                    <TableCell className="text-sm text-[#a3a3a3]">{doc.document_type}</TableCell>
                    <TableCell className="text-sm text-[#a3a3a3]">{formatDate(doc.uploaded_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="text-[#a3a3a3] hover:text-white hover:bg-transparent"
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
