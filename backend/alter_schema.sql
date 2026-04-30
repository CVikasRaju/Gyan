-- Run this in your Supabase Dashboard SQL Editor
-- Because the original Product Specification Data Model omitted a 'Headline/Title' field, 
-- but the UI requires it across all S1 and S2 screens, we must patch the table schema!

ALTER TABLE public.digests 
ADD COLUMN title text;
