-- Run this script in the Supabase SQL Editor to create the verification_logs table

CREATE TABLE IF NOT EXISTS public.verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id bigint NOT NULL,
  status text NOT NULL,
  verified_at timestamp with time zone DEFAULT now(),
  owner text,
  computed_hash text,
  stored_hash text
);

-- Optional: Create an index on evidence_id or status for faster queries
CREATE INDEX IF NOT EXISTS verification_logs_status_idx ON public.verification_logs (status);
