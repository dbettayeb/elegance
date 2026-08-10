-- Add custom font size and verse fields to weddings table
ALTER TABLE weddings
ADD COLUMN custom_font_size integer DEFAULT 100,
ADD COLUMN verse_ar text;

-- Create index for custom_font_size if needed for filtering
CREATE INDEX idx_weddings_custom_font_size ON weddings(custom_font_size);
