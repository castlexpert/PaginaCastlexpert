/*
  # Castlexpert Website Schema

  1. New Tables
    - `visits`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz) - timestamp of visit
      - Used to track and count website visits
    
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) - visitor's name
      - `email` (text) - visitor's email
      - `message` (text) - message content
      - `created_at` (timestamptz) - submission timestamp
      - `read` (boolean) - whether admin has read the message
  
  2. Security
    - Enable RLS on both tables
    - Public can insert visits (for tracking)
    - Public can insert contact messages (for form submission)
    - Only authenticated users can read data (for admin dashboard)
*/

CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits"
  ON visits
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view visit count"
  ON visits
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);