CREATE POLICY "Users upload own club media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'club-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users read own club media" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'club-media' AND ((storage.foldername(name))[1] = auth.uid()::text OR private.has_role(auth.uid(), 'admin'::text)));
CREATE POLICY "Users delete own club media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'club-media' AND (storage.foldername(name))[1] = auth.uid()::text);