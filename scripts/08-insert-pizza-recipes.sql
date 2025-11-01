-- Insert Pizza Recipes and Ingredients
-- This script inserts pizza recipes into the recipes table
-- and their ingredients into the ingredients table

-- =========================
-- Step 1: Insert Pizza Recipes
-- =========================
INSERT INTO recipes (id, name, description, difficulty, category, prep_time_minutes, cook_time_minutes, servings, instructions)
VALUES
  ('b4a8b0f3-182c-4db7-9df2-7af315e2031e', 'Margherita', 'Classic Neapolitan pizza with tomato, mozzarella, and basil', 'medium', 'Pizza', 10, 90, 1,
  '1. Spread tomato sauce over dough.\n2. Add fresh mozzarella and basil leaves.\n3. Drizzle olive oil.\n4. Add grated Parmesan.\n5. Bake at 450°C for 60-90 seconds.'),

  ('a26f50b2-3bc1-4987-b5bb-2cc47403e9ef', 'Marinara', 'Traditional pizza with tomato, garlic, oregano, and olive oil', 'easy', 'Pizza', 10, 90, 1,
  '1. Spread tomato sauce.\n2. Add sliced garlic and oregano.\n3. Drizzle olive oil.\n4. Bake at high heat until crisp.'),

  ('5c4c9a14-b154-4e28-90a0-1b9cfa26439a', 'Margherita Extra (DOP)', 'Premium Margherita made with DOP ingredients', 'medium', 'Pizza', 10, 90, 1,
  '1. Spread San Marzano DOP tomato sauce.\n2. Add buffalo mozzarella DOP and basil.\n3. Drizzle olive oil DOP.\n4. Add Parmesan.\n5. Bake at 450°C.'),

  ('df97a57e-204f-4b4e-998c-979cfdb8417f', 'Bufalina', 'Pizza topped with fresh buffalo mozzarella and cherry tomatoes', 'medium', 'Pizza', 10, 90, 1,
  '1. Spread tomato sauce.\n2. Add cherry tomatoes and buffalo mozzarella.\n3. Add basil and olive oil.\n4. Bake quickly.'),

  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Capricciosa', 'Classic Italian pizza with ham, artichokes, mushrooms, and olives', 'medium', 'Pizza', 15, 90, 1,
  '1. Spread tomato sauce.\n2. Add mozzarella, ham, mushrooms, olives, and artichokes.\n3. Drizzle olive oil and bake.'),

  ('6b1ccf3e-34da-44ef-8e93-f4530eae77e2', 'Diavola', 'Spicy salami pizza with mozzarella and tomato sauce', 'medium', 'Pizza', 10, 90, 1,
  '1. Spread tomato sauce.\n2. Add mozzarella and spicy salami slices.\n3. Add olive oil and chili flakes.\n4. Bake.'),

  ('cc4bfc35-8dbf-4df5-91b4-513bb3cdb43a', 'Quattro Formaggi', 'Four-cheese pizza: mozzarella, gorgonzola, parmesan, provolone', 'medium', 'Pizza', 10, 90, 1,
  '1. Add cheese mix over the dough.\n2. Drizzle cream and olive oil.\n3. Bake until golden and bubbling.'),

  ('82dbef7c-3b0a-4d7f-84cb-70ffccf6e85e', 'Ortolana / Vegetariana', 'Vegetable pizza with zucchini, eggplant, and bell peppers', 'medium', 'Pizza', 15, 90, 1,
  '1. Spread tomato sauce.\n2. Add grilled vegetables and mozzarella.\n3. Drizzle olive oil and bake.');

-- =========================
-- Step 2: Insert Ingredients for Each Pizza
-- =========================
INSERT INTO ingredients (recipe_id, name, amount, unit)
VALUES
  -- Margherita
  ('b4a8b0f3-182c-4db7-9df2-7af315e2031e', 'Tomato sauce', 80, 'g'),
  ('b4a8b0f3-182c-4db7-9df2-7af315e2031e', 'Fresh mozzarella (Fior di Latte)', 100, 'g'),
  ('b4a8b0f3-182c-4db7-9df2-7af315e2031e', 'Extra virgin olive oil', 10, 'ml'),
  ('b4a8b0f3-182c-4db7-9df2-7af315e2031e', 'Fresh basil', 3, 'leaves'),
  ('b4a8b0f3-182c-4db7-9df2-7af315e2031e', 'Grated Parmesan', 10, 'g'),
  ('b4a8b0f3-182c-4db7-9df2-7af315e2031e', 'Salt', 1, 'pinch'),

  -- Marinara
  ('a26f50b2-3bc1-4987-b5bb-2cc47403e9ef', 'Tomato sauce', 100, 'g'),
  ('a26f50b2-3bc1-4987-b5bb-2cc47403e9ef', 'Garlic', 2, 'cloves'),
  ('a26f50b2-3bc1-4987-b5bb-2cc47403e9ef', 'Oregano', 1, 'g'),
  ('a26f50b2-3bc1-4987-b5bb-2cc47403e9ef', 'Extra virgin olive oil', 10, 'ml'),
  ('a26f50b2-3bc1-4987-b5bb-2cc47403e9ef', 'Salt', 1, 'pinch'),

  -- Margherita Extra (DOP)
  ('5c4c9a14-b154-4e28-90a0-1b9cfa26439a', 'San Marzano DOP tomato', 80, 'g'),
  ('5c4c9a14-b154-4e28-90a0-1b9cfa26439a', 'Mozzarella di Bufala Campana DOP', 90, 'g'),
  ('5c4c9a14-b154-4e28-90a0-1b9cfa26439a', 'Extra virgin olive oil', 10, 'ml'),
  ('5c4c9a14-b154-4e28-90a0-1b9cfa26439a', 'Fresh basil', 4, 'leaves'),
  ('5c4c9a14-b154-4e28-90a0-1b9cfa26439a', 'Parmesan', 10, 'g'),
  ('5c4c9a14-b154-4e28-90a0-1b9cfa26439a', 'Salt', 1, 'pinch'),

  -- Bufalina
  ('df97a57e-204f-4b4e-998c-979cfdb8417f', 'Tomato sauce', 70, 'g'),
  ('df97a57e-204f-4b4e-998c-979cfdb8417f', 'Mozzarella di Bufala Campana', 100, 'g'),
  ('df97a57e-204f-4b4e-998c-979cfdb8417f', 'Cherry tomatoes', 60, 'g'),
  ('df97a57e-204f-4b4e-998c-979cfdb8417f', 'Extra virgin olive oil', 10, 'ml'),
  ('df97a57e-204f-4b4e-998c-979cfdb8417f', 'Fresh basil', 3, 'leaves'),

  -- Capricciosa
  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Tomato sauce', 70, 'g'),
  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Mozzarella', 100, 'g'),
  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Cooked ham', 40, 'g'),
  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Mushrooms', 40, 'g'),
  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Artichokes', 30, 'g'),
  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Black olives', 20, 'g'),
  ('c9a4214d-9dbb-4d0d-9a52-b96c1a78dca7', 'Olive oil', 10, 'ml'),

  -- Diavola
  ('6b1ccf3e-34da-44ef-8e93-f4530eae77e2', 'Tomato sauce', 80, 'g'),
  ('6b1ccf3e-34da-44ef-8e93-f4530eae77e2', 'Mozzarella', 100, 'g'),
  ('6b1ccf3e-34da-44ef-8e93-f4530eae77e2', 'Spicy salami', 40, 'g'),
  ('6b1ccf3e-34da-44ef-8e93-f4530eae77e2', 'Extra virgin olive oil', 10, 'ml'),
  ('6b1ccf3e-34da-44ef-8e93-f4530eae77e2', 'Chili flakes', 1, 'g'),

  -- Quattro Formaggi
  ('cc4bfc35-8dbf-4df5-91b4-513bb3cdb43a', 'Mozzarella', 60, 'g'),
  ('cc4bfc35-8dbf-4df5-91b4-513bb3cdb43a', 'Gorgonzola', 40, 'g'),
  ('cc4bfc35-8dbf-4df5-91b4-513bb3cdb43a', 'Parmigiano Reggiano', 20, 'g'),
  ('cc4bfc35-8dbf-4df5-91b4-513bb3cdb43a', 'Provolone', 40, 'g'),
  ('cc4bfc35-8dbf-4df5-91b4-513bb3cdb43a', 'Cream', 20, 'ml'),

  -- Ortolana / Vegetariana
  ('82dbef7c-3b0a-4d7f-84cb-70ffccf6e85e', 'Tomato sauce', 70, 'g'),
  ('82dbef7c-3b0a-4d7f-84cb-70ffccf6e85e', 'Mozzarella', 90, 'g'),
  ('82dbef7c-3b0a-4d7f-84cb-70ffccf6e85e', 'Grilled zucchini', 40, 'g'),
  ('82dbef7c-3b0a-4d7f-84cb-70ffccf6e85e', 'Grilled eggplant', 40, 'g'),
  ('82dbef7c-3b0a-4d7f-84cb-70ffccf6e85e', 'Red bell pepper', 30, 'g'),
  ('82dbef7c-3b0a-4d7f-84cb-70ffccf6e85e', 'Olive oil', 10, 'ml');

