/*
  # DTDC Tracking History Schema

  1. New Tables
    - `tracking_history`
      - `id` (uuid, primary key)
      - `tracking_number` (text, indexed) - The DTDC tracking number
      - `tracked_at` (timestamptz) - When the tracking was performed
      - `response_data` (jsonb) - Full tracking response from DTDC
      - `status` (text) - Current status of shipment
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on `tracking_history` table
    - Public read access (no auth required for this app)
    - Public write access for tracking entries
    
  3. Indexes
    - Index on tracking_number for fast lookups
    - Index on tracked_at for recent searches
*/

-- Create tracking_history table
CREATE TABLE IF NOT EXISTS tracking_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text NOT NULL,
  tracked_at timestamptz DEFAULT now(),
  response_data jsonb,
  status text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tracking_number ON tracking_history(tracking_number);
CREATE INDEX IF NOT EXISTS idx_tracked_at ON tracking_history(tracked_at DESC);

-- Enable Row Level Security
ALTER TABLE tracking_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tracking history (public app)
CREATE POLICY "Anyone can read tracking history"
  ON tracking_history
  FOR SELECT
  USING (true);

-- Allow anyone to insert tracking history
CREATE POLICY "Anyone can insert tracking history"
  ON tracking_history
  FOR INSERT
  WITH CHECK (true);