# Supabase Storage Setup

To enable document uploads, you need to create a storage bucket in Supabase:

## Steps:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **Create a new bucket**
4. Name it: `documents`
5. Set it as **Public** (or configure RLS policies if you want private)
6. Click **Create bucket**

## Storage Policies (if using RLS):

If you want to restrict access, add these policies:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload documents for their own deals"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM deals WHERE user_id = auth.uid()
  )
);

-- Allow users to view documents for their own deals
CREATE POLICY "Users can view documents for their own deals"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM deals WHERE user_id = auth.uid()
  )
);
```

## File Size Limits:

- Maximum file size: 10MB (configured in the upload component)
- Only PDF files are accepted









