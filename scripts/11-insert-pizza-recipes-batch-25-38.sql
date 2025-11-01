-- 🍕 Neapolitan Pizzas Batch (25–38)
-- Category: Pizza
-- Units: g / ml

INSERT INTO recipes (id, name, description, difficulty, category, prep_time_minutes, cook_time_minutes, servings, instructions, image_url)
VALUES
-- 25. Funghi Porcini e Tartufo Nero
('25a1b2c3-0000-4000-8000-111122223333', 'Funghi Porcini & Tartufo Nero', 'White pizza with porcini mushrooms and black truffle.', 'medium', 'Pizza', 15, 90, 1,
 '1. Spread light cream base.\n2. Add mozzarella and sautéed porcini mushrooms.\n3. Bake until golden and then drizzle black truffle oil.', NULL),

-- 26. Mortadella e Limone
('26a1b2c3-0000-4000-8000-111122223334', 'Mortadella & Limone', 'White pizza topped with thin-sliced mortadella and fresh lemon zest.', 'medium', 'Pizza', 10, 90, 1,
 '1. Bake base with mozzarella.\n2. Add slices of mortadella and lemon zest after baking.\n3. Drizzle olive oil and serve.', NULL),

-- 27. Pumpkin Cream & Speck
('27a1b2c3-0000-4000-8000-111122223335', 'Pumpkin Cream & Speck', 'Seasonal white pizza with pumpkin cream base and crispy speck.', 'medium', 'Pizza', 15, 90, 1,
 '1. Spread pumpkin cream base.\n2. Add mozzarella and bake.\n3. Top with crispy speck and drizzle olive oil.', NULL),

-- 28. Zucchini Cream & Shrimp
('28a1b2c3-0000-4000-8000-111122223336', 'Zucchini Cream & Shrimp', 'White pizza with zucchini cream and sautéed shrimp.', 'medium', 'Pizza', 20, 90, 1,
 '1. Spread zucchini cream.\n2. Add mozzarella and pre-cooked shrimp.\n3. Bake until crust blisters and serve fresh.', NULL),

-- 29. Carciofi & Gorgonzola
('29a1b2c3-0000-4000-8000-111122223337', 'Carciofi & Gorgonzola', 'White pizza with artichokes and gorgonzola cheese.', 'medium', 'Pizza', 15, 90, 1,
 '1. Spread cream or light sauce.\n2. Add mozzarella, artichoke hearts and gorgonzola.\n3. Bake until cheese is bubbly.', NULL),

-- 30. Tuna & Red Onion
('30a1b2c3-0000-4000-8000-111122223338', 'Tuna & Red Onion', 'Tomato-based pizza with tuna chunks and red onion slices.', 'medium', 'Pizza', 10, 90, 1,
 '1. Spread tomato sauce.\n2. Add mozzarella, tuna and red onion.\n3. Bake quickly and finish with olive oil.', NULL),

-- 31. Porchetta & Smoked Scamorza
('31a1b2c3-0000-4000-8000-111122223339', 'Porchetta & Smoked Scamorza', 'White pizza topped with porchetta slices and smoked scamorza cheese.', 'medium', 'Pizza', 15, 90, 1,
 '1. Spread light cream base.\n2. Add smoked scamorza and bake.\n3. Top with porchetta slices and drizzle olive oil.', NULL),

-- 32. Basil Pesto & Cherry Tomatoes
('32a1b2c3-0000-4000-8000-111122223330', 'Basil Pesto & Cherry Tomatoes', 'Green/white pizza with basil pesto and cherry tomatoes.', 'easy', 'Pizza', 10, 90, 1,
 '1. Spread basil pesto base instead of tomato.\n2. Add mozzarella and cherry tomatoes.\n3. Bake until golden spots.', NULL),

-- 33. Cacio e Pepe Pizza
('33a1b2c3-0000-4000-8000-111122223331', 'Cacio e Pepe Pizza', 'Minimal white pizza inspired by pasta cacio e pepe: pecorino cheese and black pepper.', 'medium', 'Pizza', 10, 90, 1,
 '1. Spread light cream.\n2. Add mozzarella and pecorino.\n3. Bake and finish with lots of black pepper.', NULL),

-- 34. Salsiccia & Patate
('34a1b2c3-0000-4000-8000-111122223332', 'Salsiccia & Patate', 'Rustic pizza with Italian sausage and thin-sliced potatoes.', 'medium', 'Pizza', 15, 90, 1,
 '1. Spread tomato sauce or light cream.\n2. Add mozzarella, sausage and potato slices.\n3. Bake until crispy.', NULL),

-- 35. Melanzane Parmigiana Pizza
('35a1b2c3-0000-4000-8000-111122223333', 'Melanzane Parmigiana Pizza', 'Pizza inspired by eggplant parmigiana: eggplant slices, mozzarella, parmesan, tomato sauce.', 'medium', 'Pizza', 20, 90, 1,
 '1. Spread tomato sauce.\n2. Add fried eggplant slices, mozzarella and parmesan.\n3. Bake until cheese is melted.', NULL),

-- 36. Nutella Pizza
('36a1b2c3-0000-4000-8000-111122223334', 'Nutella Pizza', 'Dessert pizza topped with Nutella and optional fresh fruit.', 'easy', 'Pizza', 5, 90, 1,
 '1. Bake crust.\n2. Spread Nutella while warm and add fresh fruit or nuts.\n3. Serve immediately.', NULL),

-- 37. Ricotta & Pistachio Pizza
('37a1b2c3-0000-4000-8000-111122223335', 'Ricotta & Pistachio Pizza', 'Dessert/gourmet pizza with ricotta, pistachios and honey drizzle.', 'easy', 'Pizza', 10, 90, 1,
 '1. Spread ricotta base.\n2. Add mozzarella (optional), sprinkle pistachios and drizzle honey.\n3. Serve immediately.', NULL),

-- 38. Mascarpone & Berries
('38a1b2c3-0000-4000-8000-111122223336', 'Mascarpone & Berries', 'Dessert pizza with mascarpone cheese and mixed berries.', 'easy', 'Pizza', 5, 90, 1,
 '1. Bake crust.\n2. Add mascarpone and top with fresh berries.\n3. Serve chilled or room-temp.', NULL);

-- 🍕 INGREDIENTS
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
-- Funghi Porcini & Tartufo Nero
('25a1b2c3-0000-4000-8000-111122223333', 'Mozzarella', 80, 'g'),
('25a1b2c3-0000-4000-8000-111122223333', 'Porcini Mushrooms', 50, 'g'),
('25a1b2c3-0000-4000-8000-111122223333', 'Black Truffle Oil', 5, 'ml'),
('25a1b2c3-0000-4000-8000-111122223333', 'Grated Parmesan', 20, 'g'),

-- Mortadella & Limone
('26a1b2c3-0000-4000-8000-111122223334', 'Mozzarella', 90, 'g'),
('26a1b2c3-0000-4000-8000-111122223334', 'Mortadella Slices', 50, 'g'),
('26a1b2c3-0000-4000-8000-111122223334', 'Lemon Zest', 5, 'g'),
('26a1b2c3-0000-4000-8000-111122223334', 'Olive Oil', 10, 'ml'),

-- Pumpkin Cream & Speck
('27a1b2c3-0000-4000-8000-111122223335', 'Pumpkin Cream', 70, 'g'),
('27a1b2c3-0000-4000-8000-111122223335', 'Mozzarella', 100, 'g'),
('27a1b2c3-0000-4000-8000-111122223335', 'Speck (crispy)', 40, 'g'),
('27a1b2c3-0000-4000-8000-111122223335', 'Olive Oil', 10, 'ml'),

-- Zucchini Cream & Shrimp
('28a1b2c3-0000-4000-8000-111122223336', 'Zucchini Cream', 70, 'g'),
('28a1b2c3-0000-4000-8000-111122223336', 'Mozzarella', 90, 'g'),
('28a1b2c3-0000-4000-8000-111122223336', 'Shrimp (pre-cooked)', 50, 'g'),
('28a1b2c3-0000-4000-8000-111122223336', 'Olive Oil', 10, 'ml'),

-- Carciofi & Gorgonzola
('29a1b2c3-0000-4000-8000-111122223337', 'Mozzarella', 80, 'g'),
('29a1b2c3-0000-4000-8000-111122223337', 'Artichoke Hearts', 50, 'g'),
('29a1b2c3-0000-4000-8000-111122223337', 'Gorgonzola', 40, 'g'),
('29a1b2c3-0000-4000-8000-111122223337', 'Olive Oil', 10, 'ml'),

-- Tuna & Red Onion
('30a1b2c3-0000-4000-8000-111122223338', 'Tomato Sauce', 80, 'g'),
('30a1b2c3-0000-4000-8000-111122223338', 'Mozzarella', 90, 'g'),
('30a1b2c3-0000-4000-8000-111122223338', 'Tuna (chunk)', 50, 'g'),
('30a1b2c3-0000-4000-8000-111122223338', 'Red Onion (sliced)', 30, 'g'),
('30a1b2c3-0000-4000-8000-111122223338', 'Olive Oil', 10, 'ml'),

-- Porchetta & Smoked Scamorza
('31a1b2c3-0000-4000-8000-111122223339', 'Smoked Scamorza', 70, 'g'),
('31a1b2c3-0000-4000-8000-111122223339', 'Porchetta Slices', 50, 'g'),
('31a1b2c3-0000-4000-8000-111122223339', 'Olive Oil', 10, 'ml'),

-- Basil Pesto & Cherry Tomatoes
('32a1b2c3-0000-4000-8000-111122223330', 'Basil Pesto', 50, 'g'),
('32a1b2c3-0000-4000-8000-111122223330', 'Mozzarella', 90, 'g'),
('32a1b2c3-0000-4000-8000-111122223330', 'Cherry Tomatoes', 60, 'g'),
('32a1b2c3-0000-4000-8000-111122223330', 'Olive Oil', 10, 'ml'),

-- Cacio e Pepe Pizza
('33a1b2c3-0000-4000-8000-111122223331', 'Mozzarella', 70, 'g'),
('33a1b2c3-0000-4000-8000-111122223331', 'Pecorino Romano', 30, 'g'),
('33a1b2c3-0000-4000-8000-111122223331', 'Black Pepper (freshly ground)', 2, 'g'),
('33a1b2c3-0000-4000-8000-111122223331', 'Olive Oil', 10, 'ml'),

-- Salsiccia & Patate
('34a1b2c3-0000-4000-8000-111122223332', 'Tomato Sauce', 80, 'g'),
('34a1b2c3-0000-4000-8000-111122223332', 'Mozzarella', 90, 'g'),
('34a1b2c3-0000-4000-8000-111122223332', 'Italian Sausage', 60, 'g'),
('34a1b2c3-0000-4000-8000-111122223332', 'Potato Slices (thin)', 50, 'g'),
('34a1b2c3-0000-4000-8000-111122223332', 'Olive Oil', 10, 'ml'),

-- Melanzane Parmigiana Pizza
('35a1b2c3-0000-4000-8000-111122223333', 'Tomato Sauce', 80, 'g'),
('35a1b2c3-0000-4000-8000-111122223333', 'Mozzarella', 90, 'g'),
('35a1b2c3-0000-4000-8000-111122223333', 'Fried Eggplant Slices', 60, 'g'),
('35a1b2c3-0000-4000-8000-111122223333', 'Parmesan', 30, 'g'),
('35a1b2c3-0000-4000-8000-111122223333', 'Olive Oil', 10, 'ml'),

-- Nutella Pizza
('36a1b2c3-0000-4000-8000-111122223334', 'Nutella Spread', 100, 'g'),
('36a1b2c3-0000-4000-8000-111122223334', 'Strawberries (sliced)', 50, 'g'),
('36a1b2c3-0000-4000-8000-111122223334', 'Banana (sliced)', 50, 'g'),
('36a1b2c3-0000-4000-8000-111122223334', 'Olive Oil', 10, 'ml'),

-- Ricotta & Pistachio Pizza
('37a1b2c3-0000-4000-8000-111122223335', 'Ricotta', 90, 'g'),
('37a1b2c3-0000-4000-8000-111122223335', 'Pistachios (crushed)', 40, 'g'),
('37a1b2c3-0000-4000-8000-111122223335', 'Honey Drizzle', 15, 'ml'),
('37a1b2c3-0000-4000-8000-111122223335', 'Olive Oil', 5, 'ml'),

-- Mascarpone & Berries
('38a1b2c3-0000-4000-8000-111122223336', 'Mascarpone', 100, 'g'),
('38a1b2c3-0000-4000-8000-111122223336', 'Mixed Berries', 60, 'g'),
('38a1b2c3-0000-4000-8000-111122223336', 'Honey Drizzle', 15, 'ml'),
('38a1b2c3-0000-4000-8000-111122223336', 'Olive Oil', 5, 'ml');

