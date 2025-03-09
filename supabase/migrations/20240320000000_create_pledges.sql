-- Create pledges table
CREATE TABLE pledges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  research_id INTEGER REFERENCES research(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount DECIMAL(10,2),
  tasks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Add RLS policies
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create pledges
CREATE POLICY "Allow public to create pledges" ON pledges
  FOR INSERT TO public
  WITH CHECK (true);

-- Allow anyone to view pledges
CREATE POLICY "Allow public to view pledges" ON pledges
  FOR SELECT TO public
  USING (true);

-- Create index for faster lookups
CREATE INDEX pledges_research_id_idx ON pledges(research_id);

-- Add new columns to pledges table
ALTER TABLE pledges
ADD COLUMN first_name TEXT NOT NULL DEFAULT '',
ADD COLUMN last_name TEXT NOT NULL DEFAULT '';

-- Make amount and tasks optional
ALTER TABLE pledges
ALTER COLUMN amount DROP NOT NULL,
ALTER COLUMN tasks DROP NOT NULL;

-- Update existing rows to have empty strings for first_name and last_name
UPDATE pledges
SET first_name = '', last_name = ''
WHERE first_name IS NULL OR last_name IS NULL; 