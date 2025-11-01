-- Delete Neapolitan Pizza Batch 1 (1–8) Recipes and Ingredients
-- Run this in Supabase SQL Editor to remove the inserted pizza recipes

-- =========================
-- Step 1: Delete Ingredients First
-- (Required because of foreign key constraints)
-- =========================
DELETE FROM ingredients
WHERE recipe_id IN (
  '11111111-1111-1111-1111-111111111111', -- Margherita
  '22222222-2222-2222-2222-222222222222', -- Marinara
  '33333333-3333-3333-3333-333333333333', -- Margherita Extra (DOP)
  '44444444-4444-4444-4444-444444444444', -- Bufalina
  '55555555-5555-5555-5555-555555555555', -- Capricciosa
  '66666666-6666-6666-6666-666666666666', -- Diavola
  '77777777-7777-7777-7777-777777777777', -- Quattro Formaggi
  '88888888-8888-8888-8888-888888888888'  -- Ortolana
);

-- =========================
-- Step 2: Delete Recipes
-- =========================
DELETE FROM recipes
WHERE id IN (
  '11111111-1111-1111-1111-111111111111', -- Margherita
  '22222222-2222-2222-2222-222222222222', -- Marinara
  '33333333-3333-3333-3333-333333333333', -- Margherita Extra (DOP)
  '44444444-4444-4444-4444-444444444444', -- Bufalina
  '55555555-5555-5555-5555-555555555555', -- Capricciosa
  '66666666-6666-6666-6666-666666666666', -- Diavola
  '77777777-7777-7777-7777-777777777777', -- Quattro Formaggi
  '88888888-8888-8888-8888-888888888888'  -- Ortolana
);

-- =========================
-- Verification Query (Run this after deletion to confirm)
-- =========================
-- Check if recipes are deleted:
-- SELECT name FROM recipes WHERE id IN (
--   '11111111-1111-1111-1111-111111111111',
--   '22222222-2222-2222-2222-222222222222',
--   '33333333-3333-3333-3333-333333333333',
--   '44444444-4444-4444-4444-444444444444',
--   '55555555-5555-5555-5555-555555555555',
--   '66666666-6666-6666-6666-666666666666',
--   '77777777-7777-7777-7777-777777777777',
--   '88888888-8888-8888-8888-888888888888'
-- );
-- Should return 0 rows if deletion was successful

