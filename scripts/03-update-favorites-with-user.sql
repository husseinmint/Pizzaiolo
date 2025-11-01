-- Add user_id column to favorites table if it doesn't exist
ALTER TABLE favorites 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the old unique constraint
ALTER TABLE favorites 
DROP CONSTRAINT IF EXISTS favorites_recipe_id_key;

-- Add unique constraint on (user_id, recipe_id) so each user can only favorite a recipe once
ALTER TABLE favorites 
ADD CONSTRAINT favorites_user_recipe_unique UNIQUE(user_id, recipe_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Update RLS policies to be user-specific
DROP POLICY IF EXISTS "Enable read access for all users" ON favorites;
DROP POLICY IF EXISTS "Enable all operations" ON favorites;

-- Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);


