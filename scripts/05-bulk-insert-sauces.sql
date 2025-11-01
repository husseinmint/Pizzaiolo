-- Bulk Insert Pizza Sauces
-- This script inserts multiple sauce recipes into the database
-- Modify the VALUES section with your actual sauce data

-- Example structure for a sauce recipe:
-- - name: Sauce name
-- - description: Optional description
-- - difficulty: 'easy', 'medium', or 'hard'
-- - prep_time_minutes: Preparation time in minutes
-- - cook_time_minutes: Cooking time in minutes (if applicable)
-- - servings: Number of servings (can be NULL)
-- - category: 'Sauce' or your preferred category
-- - instructions: Step-by-step instructions (can be NULL)
-- - image_url: Optional image URL (can be NULL)

-- Insert sauces using INSERT INTO ... VALUES
INSERT INTO recipes (name, description, difficulty, prep_time_minutes, cook_time_minutes, servings, category, instructions, image_url)
VALUES
  -- Example Sauce 1
  (
    'Classic Marinara Sauce',
    'Traditional Italian tomato sauce perfect for pizza',
    'easy',
    10,  -- prep_time_minutes
    30,  -- cook_time_minutes
    4,   -- servings
    'Sauce',
    '1. Heat olive oil in a pan over medium heat\n2. Add garlic and cook until fragrant\n3. Add crushed tomatoes\n4. Season with salt, pepper, and herbs\n5. Simmer for 25-30 minutes',
    NULL  -- image_url (optional)
  ),
  -- Example Sauce 2
  (
    'White Garlic Sauce',
    'Creamy garlic sauce for white pizzas',
    'easy',
    5,
    15,
    4,
    'Sauce',
    '1. Melt butter in a pan\n2. Add minced garlic and cook for 1 minute\n3. Add heavy cream\n4. Simmer until thickened\n5. Season with salt and pepper',
    NULL
  ),
  -- Example Sauce 3
  (
    'Spicy Arrabbiata Sauce',
    'Spicy tomato sauce with red peppers',
    'medium',
    10,
    25,
    4,
    'Sauce',
    '1. Heat oil and sauté garlic and red pepper flakes\n2. Add tomatoes and simmer\n3. Add fresh basil\n4. Cook until thickened',
    NULL
  );

-- If you have ingredients for each sauce, insert them separately
-- You'll need to get the recipe IDs first, then insert ingredients

-- Example: Insert ingredients for the first sauce (replace recipe_id with actual UUID)
-- First, let's create a helper query to get recipe IDs by name:
-- SELECT id, name FROM recipes WHERE category = 'Sauce';

-- Then insert ingredients (replace the recipe_id with actual UUID from above query)
/*
INSERT INTO ingredients (recipe_id, name, amount, unit)
VALUES
  -- Ingredients for Classic Marinara Sauce (replace UUID)
  ('00000000-0000-0000-0000-000000000001', 'Olive Oil', 2, 'tbsp'),
  ('00000000-0000-0000-0000-000000000001', 'Garlic', 3, 'cloves'),
  ('00000000-0000-0000-0000-000000000001', 'Crushed Tomatoes', 400, 'g'),
  ('00000000-0000-0000-0000-000000000001', 'Salt', 1, 'tsp'),
  ('00000000-0000-0000-0000-000000000001', 'Black Pepper', 0.5, 'tsp'),
  ('00000000-0000-0000-0000-000000000001', 'Basil', 5, 'leaves');
*/

-- Alternative: Insert recipes with ingredients using a transaction
-- This is more complex but ensures data consistency

/*
BEGIN;

-- Insert sauce recipe and get the ID
DO $$
DECLARE
  sauce_id UUID;
BEGIN
  -- Insert recipe
  INSERT INTO recipes (name, description, difficulty, prep_time_minutes, cook_time_minutes, servings, category, instructions)
  VALUES ('Pesto Sauce', 'Fresh basil pesto', 'easy', 10, 0, 4, 'Sauce', '1. Blend basil, pine nuts, garlic\n2. Add olive oil gradually\n3. Add parmesan and blend')
  RETURNING id INTO sauce_id;
  
  -- Insert ingredients for this sauce
  INSERT INTO ingredients (recipe_id, name, amount, unit)
  VALUES
    (sauce_id, 'Fresh Basil', 50, 'g'),
    (sauce_id, 'Pine Nuts', 30, 'g'),
    (sauce_id, 'Garlic', 2, 'cloves'),
    (sauce_id, 'Olive Oil', 100, 'ml'),
    (sauce_id, 'Parmesan Cheese', 50, 'g'),
    (sauce_id, 'Salt', 0.5, 'tsp');
END $$;

COMMIT;
*/

