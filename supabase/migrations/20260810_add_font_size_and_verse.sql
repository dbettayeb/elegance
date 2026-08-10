-- Add custom font size and verse fields to weddings table
ALTER TABLE weddings
ADD COLUMN IF NOT EXISTS custom_font_size integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS verse_ar text;
