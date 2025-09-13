/*
# Storage Buckets and Policies

## Buckets Created
1. **product-images**: Product photos and galleries
2. **user-avatars**: User profile pictures
3. **project-images**: Project photos and galleries
4. **documents**: Receipts, invoices, and other documents

## Security
- Public read access for product and project images
- Authenticated users can upload avatars
- Admins can upload content images
*/

-- ===============================================
-- STORAGE BUCKETS
-- ===============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 5242880, '{"image/jpeg","image/png","image/webp"}'),
  ('user-avatars', 'user-avatars', true, 2097152, '{"image/jpeg","image/png","image/webp"}'),
  ('project-images', 'project-images', true, 5242880, '{"image/jpeg","image/png","image/webp"}'),
  ('documents', 'documents', false, 10485760, '{"application/pdf","text/plain","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"}')
ON CONFLICT (id) DO NOTHING;

-- ===============================================
-- STORAGE POLICIES
-- ===============================================

-- Product images - public read, admin write
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin', 'web_admin')
    )
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin', 'web_admin')
    )
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin', 'web_admin')
    )
  );

-- User avatars - users can manage their own
CREATE POLICY "Anyone can view user avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Project images - public read, web admin write
CREATE POLICY "Anyone can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Web admins can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'web_admin')
    )
  );

CREATE POLICY "Web admins can update project images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'web_admin')
    )
  );

CREATE POLICY "Web admins can delete project images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'web_admin')
    )
  );

-- Documents - private, users can access own documents, admins can access all
CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin', 'helpdesk')
    )
  );

CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('system_admin', 'sales_admin', 'helpdesk')
    )
  );