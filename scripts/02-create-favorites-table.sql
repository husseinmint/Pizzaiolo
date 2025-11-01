-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(recipe_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON favorites(recipe_id);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Enable read access for all users" ON favorites
  FOR SELECT USING (true);

-- Allow all operations (for demo - in production add proper auth)
CREATE POLICY "Enable all operations" ON favorites
  FOR ALL USING (true) WITH CHECK (true);

