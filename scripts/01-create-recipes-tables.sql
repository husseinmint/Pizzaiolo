-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  category TEXT,
  instructions TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2),
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(recipe_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON favorites(recipe_id);

-- Add RLS policies (since this is a public recipe manager, we allow public access)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Enable read access for all users" ON recipes
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON favorites
  FOR SELECT USING (true);

-- Allow all operations (for demo - in production add proper auth)
CREATE POLICY "Enable all operations" ON recipes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations" ON ingredients
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations" ON favorites
  FOR ALL USING (true) WITH CHECK (true);
