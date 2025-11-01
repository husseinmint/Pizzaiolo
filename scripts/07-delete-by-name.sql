-- Alternative: Delete by Recipe Name (if you don't have the UUIDs)
-- Use this if you want to delete by name instead of UUID

-- =========================
-- Delete by Name (More Flexible)
-- =========================

-- Step 1: Delete ingredients for recipes matching these names
DELETE FROM ingredients
WHERE recipe_id IN (
  SELECT id FROM recipes
  WHERE name IN (
    'Margherita',
    'Marinara',
    'Margherita Extra (DOP)',
    'Bufalina',
    'Capricciosa',
    'Diavola',
    'Quattro Formaggi',
    'Ortolana (Vegetariana)'
  )
);

-- Step 2: Delete the recipes
DELETE FROM recipes
WHERE name IN (
  'Margherita',
  'Marinara',
  'Margherita Extra (DOP)',
  'Bufalina',
  'Capricciosa',
  'Diavola',
  'Quattro Formaggi',
  'Ortolana (Vegetariana)'
);

-- =========================
-- Or delete ALL recipes in 'Pizza' category:
-- =========================
-- WARNING: This will delete ALL pizza recipes, not just these 8!
/*
DELETE FROM ingredients
WHERE recipe_id IN (
  SELECT id FROM recipes WHERE category = 'Pizza'
);

DELETE FROM recipes
WHERE category = 'Pizza';
*/

