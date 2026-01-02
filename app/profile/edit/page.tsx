'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/components/ProfileProvider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, CheckCircle2, Clock, XCircle, ArrowLeft, Camera, X as XIcon } from 'lucide-react';
import type { UserRole } from '@/types/profile';

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, refreshProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);
  const [requestingVerification, setRequestingVerification] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    bio: '',
    phone: '',
    location: '',
    roles: [] as UserRole[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        roles: profile.role || [],
      });
    }
  }, [profile]);

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !profile) return;

    setUploadingAvatar(true);
    setError(null);

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${profile.id}/avatar_${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const updated = await updateProfile({ avatar_url: publicUrl });
      
      if (!updated) {
        throw new Error('Failed to update profile with new avatar URL');
      }

      await refreshProfile();

      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setError(err.message || 'Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!profile) return;
    
    setUploadingAvatar(true);
    try {
      await updateProfile({ avatar_url: null });
      await refreshProfile();
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to remove avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const updated = await updateProfile({
      full_name: formData.full_name,
      company_name: formData.company_name || null,
      bio: formData.bio || null,
      phone: formData.phone || null,
      location: formData.location || null,
      role: formData.roles,
    });

    if (updated) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('Failed to update profile');
    }
    setLoading(false);
  };

  const handleVerificationRequest = async () => {
    if (!profile || verificationDocs.length === 0) return;

    setRequestingVerification(true);
    try {
      // Upload documents
      const uploadedUrls: string[] = [];
      for (const doc of verificationDocs) {
        const fileExt = doc.name.split('.').pop();
        const fileName = `${profile.id}/${Date.now()}_${doc.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('verification-docs')
          .upload(fileName, doc);

        if (!uploadError) {
          const { data } = supabase.storage.from('verification-docs').getPublicUrl(fileName);
          uploadedUrls.push(data.publicUrl);
        }
      }

      // Create verification request
      await supabase.from('verification_requests').insert({
        user_id: profile.id,
        documents: uploadedUrls,
      });

      // Update profile status
      await updateProfile({
        verification_status: 'pending',
        verification_requested_at: new Date().toISOString(),
      });

      await refreshProfile();
      setVerificationDocs([]);
    } catch (err) {
      console.error('Verification request error:', err);
    } finally {
      setRequestingVerification(false);
    }
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  const verificationStatusIcon = {
    unverified: null,
    pending: <Clock className="text-yellow-600" size={20} />,
    verified: <CheckCircle2 className="text-green-600" size={20} />,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="gap-2">
          <ArrowLeft size={16} />
          Dashboard
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>
        <Button variant="outline" onClick={() => router.push('/profile')}>
          View Profile
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
          Profile updated successfully!
        </div>
      )}

      {/* Avatar Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-border">
                <AvatarImage src={avatarPreview || profile?.avatar_url || undefined} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                  {profile?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>
              {(avatarPreview || profile?.avatar_url) && !uploadingAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <XIcon size={16} />
                </button>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Upload a new profile picture</p>
                <p className="text-xs text-muted-foreground mb-3">
                  JPG, PNG or GIF. Max size 5MB. Recommended: 400x400px
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  disabled={uploadingAvatar}
                >
                  <label className="cursor-pointer">
                    <Camera size={16} className="mr-2" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={uploadingAvatar}
                    />
                  </label>
                </Button>
                {avatarFile && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                      disabled={uploadingAvatar}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
              {avatarFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {avatarFile.name} ({(avatarFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>Roles *</Label>
              <div className="space-y-2">
                {(['buyer', 'seller', 'trader'] as UserRole[]).map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={formData.roles.includes(role)}
                      onCheckedChange={() => handleRoleToggle(role)}
                    />
                    <Label htmlFor={role} className="capitalize cursor-pointer">{role}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 size={16} className="mr-2 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Verification Status
            {verificationStatusIcon[profile.verification_status]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={profile.verification_status === 'verified' ? 'default' : 'secondary'}>
              {profile.verification_status.toUpperCase()}
            </Badge>
          </div>

          {profile.verification_status === 'unverified' && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Get verified to build trust with other traders. Upload your business documents.
              </p>
              <div className="space-y-2">
                <Label htmlFor="docs">Upload Documents (Business License, ID, etc.)</Label>
                <Input
                  id="docs"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setVerificationDocs(Array.from(e.target.files || []))}
                />
                {verificationDocs.length > 0 && (
                  <p className="text-sm text-neutral-500">{verificationDocs.length} file(s) selected</p>
                )}
              </div>
              <Button
                onClick={handleVerificationRequest}
                disabled={verificationDocs.length === 0 || requestingVerification}
              >
                {requestingVerification ? <><Loader2 size={16} className="mr-2 animate-spin" />Submitting...</> : 'Request Verification'}
              </Button>
            </div>
          )}

          {profile.verification_status === 'pending' && (
            <p className="text-sm text-neutral-600">
              Your verification request is being reviewed. We'll notify you once it's approved.
            </p>
          )}

          {profile.verification_status === 'verified' && (
            <p className="text-sm text-neutral-600">
              Your account is verified! This badge will be displayed on your profile.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}




