-- 🍕 Neapolitan Pizzas Batch (9–16)
-- Category: Pizza
-- Units: g / ml

INSERT INTO recipes (id, name, description, difficulty, category, prep_time_minutes, cook_time_minutes, servings, instructions, image_url)
VALUES
-- 9. Prosciutto e Funghi
('b9a8e7d0-23c1-4c1e-b9a7-2f1e9a1bdf21', 
 'Prosciutto e Funghi', 
 'Classic Neapolitan pizza with tomato sauce, mozzarella, cooked ham, and mushrooms.',
 'medium', 
 'Pizza',
 15,
 90,
 1,
 '1. Spread tomato sauce evenly.\n2. Add mozzarella, sliced mushrooms, and prosciutto cotto.\n3. Bake at 450°C for 60–90 sec.\n4. Drizzle olive oil before serving.',
 NULL),

-- 10. Napoli (Anchovy Pizza)
('e3c64f9b-7f12-4b77-bb4a-0c8a50f3a4df', 
 'Napoli (Anchovy Pizza)', 
 'A strong-flavored Neapolitan pizza with anchovies, capers, and oregano.',
 'medium', 
 'Pizza',
 10,
 90,
 1,
 '1. Add tomato sauce, anchovy fillets, capers, oregano.\n2. Add mozzarella if desired.\n3. Bake until crust blisters.',
 NULL),

-- 11. Romana
('da26c8a1-0d3a-4b27-ae9e-943a0f928e73',
 'Romana',
 'Tomato-based pizza with anchovies, capers, and black olives, typical from Naples-Rome border style.',
 'medium',
 'Pizza',
 10,
 90,
 1,
 '1. Spread tomato sauce.\n2. Add anchovies, black olives, capers.\n3. Add olive oil drizzle.\n4. Bake hot and fast.',
 NULL),

-- 12. Calzone Napoletano
('a4a37cb8-1cc0-45b1-91a3-28decae2db32',
 'Calzone Napoletano',
 'Folded pizza stuffed with ricotta, mozzarella, salami, and tomato sauce.',
 'hard',
 'Pizza',
 20,
 120,
 1,
 '1. Fill dough with ricotta, mozzarella, salami, and a spoon of tomato sauce.\n2. Fold and seal edges.\n3. Bake until golden and puffed.',
 NULL),

-- 13. Salsiccia e Friarielli
('c07d2f41-69e8-4ac2-9a7d-3b07f54aef18',
 'Salsiccia e Friarielli',
 'Traditional Neapolitan pizza with Italian sausage and sautéed broccoli rabe.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Spread mozzarella.\n2. Add cooked sausage and sautéed friarielli.\n3. Bake until cheese melts.',
 NULL),

-- 14. Pistacchio & Mortadella
('d942e93e-95b8-48f7-8e1c-1d678bd68d74',
 'Pistacchio & Mortadella',
 'Gourmet white pizza with pistachio cream, mortadella, and stracciatella cheese.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Spread pistachio cream base.\n2. Add mozzarella and bake.\n3. Top with mortadella slices and stracciatella.\n4. Sprinkle crushed pistachios.',
 NULL),

-- 15. Truffle & Mushroom
('ef8d913b-f2a3-4c6d-b4d9-5b3ce68e9c87',
 'Truffle & Mushroom',
 'Rich white pizza with truffle cream and sautéed mushrooms.',
 'hard',
 'Pizza',
 20,
 90,
 1,
 '1. Spread truffle cream.\n2. Add mozzarella and mushrooms.\n3. Bake until crust blisters.\n4. Finish with truffle oil drizzle.',
 NULL),

-- 16. Parma (Crudo e Rucola)
('a7281c65-0172-4c0d-b5d1-4d2f21e21b45',
 'Parma (Crudo e Rucola)',
 'White pizza topped with prosciutto crudo, arugula, and parmesan shavings.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Bake base with mozzarella.\n2. Add prosciutto, fresh arugula, and shaved parmesan.\n3. Drizzle olive oil before serving.',
 NULL);

-- 🍕 INGREDIENTS
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
-- Prosciutto e Funghi
('b9a8e7d0-23c1-4c1e-b9a7-2f1e9a1bdf21', 'Tomato Sauce', 80, 'g'),
('b9a8e7d0-23c1-4c1e-b9a7-2f1e9a1bdf21', 'Mozzarella', 100, 'g'),
('b9a8e7d0-23c1-4c1e-b9a7-2f1e9a1bdf21', 'Cooked Ham', 50, 'g'),
('b9a8e7d0-23c1-4c1e-b9a7-2f1e9a1bdf21', 'Mushrooms', 40, 'g'),
('b9a8e7d0-23c1-4c1e-b9a7-2f1e9a1bdf21', 'Olive Oil', 10, 'ml'),

-- Napoli
('e3c64f9b-7f12-4b77-bb4a-0c8a50f3a4df', 'Tomato Sauce', 80, 'g'),
('e3c64f9b-7f12-4b77-bb4a-0c8a50f3a4df', 'Anchovy Fillets', 25, 'g'),
('e3c64f9b-7f12-4b77-bb4a-0c8a50f3a4df', 'Capers', 10, 'g'),
('e3c64f9b-7f12-4b77-bb4a-0c8a50f3a4df', 'Oregano', 1, 'g'),

-- Romana
('da26c8a1-0d3a-4b27-ae9e-943a0f928e73', 'Tomato Sauce', 80, 'g'),
('da26c8a1-0d3a-4b27-ae9e-943a0f928e73', 'Anchovy Fillets', 25, 'g'),
('da26c8a1-0d3a-4b27-ae9e-943a0f928e73', 'Capers', 10, 'g'),
('da26c8a1-0d3a-4b27-ae9e-943a0f928e73', 'Black Olives', 20, 'g'),

-- Calzone Napoletano
('a4a37cb8-1cc0-45b1-91a3-28decae2db32', 'Ricotta', 80, 'g'),
('a4a37cb8-1cc0-45b1-91a3-28decae2db32', 'Mozzarella', 80, 'g'),
('a4a37cb8-1cc0-45b1-91a3-28decae2db32', 'Salami', 40, 'g'),
('a4a37cb8-1cc0-45b1-91a3-28decae2db32', 'Tomato Sauce', 40, 'g'),

-- Salsiccia e Friarielli
('c07d2f41-69e8-4ac2-9a7d-3b07f54aef18', 'Mozzarella', 100, 'g'),
('c07d2f41-69e8-4ac2-9a7d-3b07f54aef18', 'Italian Sausage', 60, 'g'),
('c07d2f41-69e8-4ac2-9a7d-3b07f54aef18', 'Broccoli Rabe (Friarielli)', 60, 'g'),
('c07d2f41-69e8-4ac2-9a7d-3b07f54aef18', 'Olive Oil', 10, 'ml'),

-- Pistacchio & Mortadella
('d942e93e-95b8-48f7-8e1c-1d678bd68d74', 'Pistachio Cream', 60, 'g'),
('d942e93e-95b8-48f7-8e1c-1d678bd68d74', 'Mozzarella', 100, 'g'),
('d942e93e-95b8-48f7-8e1c-1d678bd68d74', 'Mortadella', 50, 'g'),
('d942e93e-95b8-48f7-8e1c-1d678bd68d74', 'Stracciatella', 40, 'g'),
('d942e93e-95b8-48f7-8e1c-1d678bd68d74', 'Crushed Pistachios', 10, 'g'),

-- Truffle & Mushroom
('ef8d913b-f2a3-4c6d-b4d9-5b3ce68e9c87', 'Truffle Cream', 50, 'g'),
('ef8d913b-f2a3-4c6d-b4d9-5b3ce68e9c87', 'Mozzarella', 100, 'g'),
('ef8d913b-f2a3-4c6d-b4d9-5b3ce68e9c87', 'Mushrooms', 50, 'g'),
('ef8d913b-f2a3-4c6d-b4d9-5b3ce68e9c87', 'Truffle Oil', 5, 'ml'),

-- Parma (Crudo e Rucola)
('a7281c65-0172-4c0d-b5d1-4d2f21e21b45', 'Mozzarella', 100, 'g'),
('a7281c65-0172-4c0d-b5d1-4d2f21e21b45', 'Prosciutto Crudo', 40, 'g'),
('a7281c65-0172-4c0d-b5d1-4d2f21e21b45', 'Arugula', 20, 'g'),
('a7281c65-0172-4c0d-b5d1-4d2f21e21b45', 'Parmesan Shavings', 10, 'g'),
('a7281c65-0172-4c0d-b5d1-4d2f21e21b45', 'Olive Oil', 10, 'ml');

