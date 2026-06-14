ALTER TABLE weddings
  ADD COLUMN background_image text NOT NULL DEFAULT 'bg-texture.jpg',
  ADD COLUMN decoration_image text NOT NULL DEFAULT 'decoration.png';
