# Bulk Insert Guide for Supabase

## How to Bulk Insert Sauces (or any recipes) into Supabase

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Prepare your data**
   - Export your Excel file to CSV format
   - Or manually format your data

2. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard
   - Navigate to **SQL Editor** (left sidebar)
   - Click **New Query**

3. **Run the SQL script**
   - Copy the SQL script from `scripts/05-bulk-insert-sauces.sql`
   - Modify the VALUES with your actual sauce data
   - Click **Run** or press `Ctrl+Enter`

4. **Insert Ingredients (if needed)**
   - First, get the recipe IDs:
     ```sql
     SELECT id, name FROM recipes WHERE category = 'Sauce';
     ```
   - Then insert ingredients using those IDs

### Method 2: Two-Step Process (Recipes First, Then Ingredients)

#### Step 1: Insert Recipes
```sql
INSERT INTO recipes (name, description, difficulty, prep_time_minutes, cook_time_minutes, servings, category, instructions)
VALUES
  ('Sauce Name 1', 'Description', 'easy', 10, 20, 4, 'Sauce', 'Instructions here'),
  ('Sauce Name 2', 'Description', 'easy', 5, 15, 4, 'Sauce', 'Instructions here');
```

#### Step 2: Insert Ingredients (after getting recipe IDs)
```sql
-- First, get recipe IDs
SELECT id, name FROM recipes WHERE name IN ('Sauce Name 1', 'Sauce Name 2');

-- Then insert ingredients (replace recipe_id with actual UUID)
INSERT INTO ingredients (recipe_id, name, amount, unit)
VALUES
  ('recipe-uuid-1', 'Ingredient Name', 100, 'g'),
  ('recipe-uuid-1', 'Another Ingredient', 2, 'tbsp');
```

### Method 3: Using CSV Import (Advanced)

1. **Export to CSV** from Excel
2. **Use Supabase Table Editor**
   - Go to **Table Editor** in Supabase
   - Select the `recipes` table
   - Click **Insert** → **Import data from CSV**
   - Upload your CSV file

**Note**: CSV import works best if your CSV columns match the database columns exactly.

### Excel to SQL Conversion Tips

If your Excel file has columns like:
- **Name** → `name`
- **Description** → `description`
- **Difficulty** → `difficulty` (must be: 'easy', 'medium', or 'hard')
- **Prep Time** → `prep_time_minutes` (number)
- **Cook Time** → `cook_time_minutes` (number)
- **Servings** → `servings` (number)
- **Category** → `category`
- **Instructions** → `instructions`

You can create SQL like this:
```sql
INSERT INTO recipes (name, description, difficulty, prep_time_minutes, cook_time_minutes, servings, category, instructions)
VALUES
  ('Sauce 1', 'Description 1', 'easy', 10, 30, 4, 'Sauce', 'Step 1\nStep 2\nStep 3'),
  ('Sauce 2', 'Description 2', 'medium', 15, 45, 6, 'Sauce', 'Step 1\nStep 2');
```

### Required Fields

- `name` (TEXT) - **Required**
- `difficulty` (TEXT) - **Required** - Must be: 'easy', 'medium', or 'hard'

### Optional Fields (can be NULL)

- `description` (TEXT)
- `prep_time_minutes` (INTEGER)
- `cook_time_minutes` (INTEGER)
- `servings` (INTEGER)
- `category` (TEXT)
- `instructions` (TEXT)
- `image_url` (TEXT)

### Example: Complete Sauce Insert

```sql
-- Insert a complete sauce recipe with ingredients
BEGIN;

DO $$
DECLARE
  new_recipe_id UUID;
BEGIN
  -- Insert the recipe
  INSERT INTO recipes (name, description, difficulty, prep_time_minutes, cook_time_minutes, servings, category, instructions)
  VALUES (
    'BBQ Sauce',
    'Homemade barbecue sauce',
    'easy',
    5,
    20,
    6,
    'Sauce',
    '1. Combine all ingredients in a saucepan\n2. Bring to a boil\n3. Reduce heat and simmer for 15 minutes\n4. Cool before using'
  )
  RETURNING id INTO new_recipe_id;
  
  -- Insert ingredients
  INSERT INTO ingredients (recipe_id, name, amount, unit)
  VALUES
    (new_recipe_id, 'Ketchup', 250, 'ml'),
    (new_recipe_id, 'Brown Sugar', 50, 'g'),
    (new_recipe_id, 'Apple Cider Vinegar', 30, 'ml'),
    (new_recipe_id, 'Worcestershire Sauce', 15, 'ml'),
    (new_recipe_id, 'Garlic Powder', 1, 'tsp'),
    (new_recipe_id, 'Onion Powder', 1, 'tsp'),
    (new_recipe_id, 'Paprika', 1, 'tsp'),
    (new_recipe_id, 'Salt', 0.5, 'tsp');
END $$;

COMMIT;
```

### Tips

1. **Use transactions** (BEGIN/COMMIT) when inserting recipes with ingredients to ensure data consistency
2. **Check for duplicates** before inserting:
   ```sql
   SELECT name FROM recipes WHERE name = 'Your Sauce Name';
   ```
3. **Use RETURNING** to get the inserted recipe ID automatically
4. **Escape single quotes** in SQL by using two single quotes: `''`
   - Example: `'Don''t forget the salt'`

### Troubleshooting

**Error: "difficulty" must be one of 'easy', 'medium', 'hard'**
- Make sure your difficulty value is exactly one of these three options

**Error: Foreign key violation**
- When inserting ingredients, make sure the `recipe_id` exists in the `recipes` table

**Error: Duplicate key**
- A recipe with that name might already exist

**Can't insert NULL in required field**
- Make sure `name` and `difficulty` are provided for each recipe

