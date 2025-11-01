-- 🍕 Neapolitan Pizzas Batch (17–24)
-- Category: Pizza
-- Units: g / ml

INSERT INTO recipes (id, name, description, difficulty, category, prep_time_minutes, cook_time_minutes, servings, instructions, image_url)
VALUES
-- 17. Burrata Special / Burratina
('11c6dca4-2a41-48d8-9e3e-9f2f17b0c022',
 'Burrata Special',
 'White pizza topped with fresh burrata, cherry tomatoes, and basil — creamy and delicate.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Bake pizza base with mozzarella.\n2. Add fresh burrata and cherry tomatoes after baking.\n3. Drizzle olive oil and garnish with basil.',
 NULL),

-- 18. Zucchine Blossom & Ricotta
('223b6f5a-82d9-4cc4-a84d-2cb1ff7398ef',
 'Zucchine Blossom & Ricotta',
 'Elegant Neapolitan white pizza with ricotta, mozzarella, and zucchini blossoms.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Spread ricotta base.\n2. Add mozzarella and zucchini blossoms.\n3. Bake until golden.\n4. Finish with olive oil drizzle.',
 NULL),

-- 19. Piennolo Tomato & Bufala
('9dfc9d1a-63c2-4a4a-96ea-715f62e6f3b3',
 'Piennolo Tomato & Bufala',
 'Authentic Neapolitan pizza with Piennolo cherry tomatoes and buffalo mozzarella.',
 'easy',
 'Pizza',
 10,
 90,
 1,
 '1. Spread crushed Piennolo tomatoes.\n2. Add buffalo mozzarella and basil.\n3. Bake quickly and serve fresh.',
 NULL),

-- 20. Porcini & Smoked Provola
('5a18e9b1-52da-4f29-b22a-582a431b00a9',
 'Porcini & Smoked Provola',
 'Rich pizza combining porcini mushrooms and smoked provola cheese for deep flavor.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Add mozzarella and smoked provola.\n2. Top with sautéed porcini.\n3. Bake and drizzle olive oil before serving.',
 NULL),

-- 21. 'Nduja & Burrata
('eab4de3d-8f52-4f4a-b90f-30cf0a01e3b8',
 'Nduja & Burrata',
 'Spicy Calabrian nduja pizza balanced with creamy burrata.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Spread tomato sauce.\n2. Add mozzarella and nduja chunks.\n3. Bake and top with burrata and basil leaves.',
 NULL),

-- 22. Carbonara Style
('b13d6794-0b6e-4780-83ab-8fbb14563e17',
 'Carbonara Style',
 'Inspired by pasta carbonara — white base, eggs, pancetta, and pecorino.',
 'hard',
 'Pizza',
 20,
 90,
 1,
 '1. Spread a light cream base.\n2. Add mozzarella, pancetta, and grated pecorino.\n3. Crack an egg in the center before baking.\n4. Bake and serve immediately.',
 NULL),

-- 23. Tartufo Bianco
('d04d5a7b-4c6a-4877-810a-7e998c4de922',
 'Tartufo Bianco',
 'Luxurious pizza with white truffle cream and fior di latte.',
 'hard',
 'Pizza',
 15,
 90,
 1,
 '1. Spread white truffle cream.\n2. Add mozzarella.\n3. Bake, then drizzle white truffle oil on top.',
 NULL),

-- 24. Mediterranea
('cfaeb528-9d12-4b18-bae5-274c43bcb173',
 'Mediterranea',
 'Mediterranean-inspired pizza with olives, cherry tomatoes, capers, and oregano.',
 'medium',
 'Pizza',
 15,
 90,
 1,
 '1. Spread tomato sauce.\n2. Add cherry tomatoes, olives, and capers.\n3. Sprinkle oregano and drizzle olive oil.\n4. Bake until crisp.',
 NULL);

-- 🍕 INGREDIENTS
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
-- Burrata Special
('11c6dca4-2a41-48d8-9e3e-9f2f17b0c022', 'Mozzarella', 80, 'g'),
('11c6dca4-2a41-48d8-9e3e-9f2f17b0c022', 'Burrata', 100, 'g'),
('11c6dca4-2a41-48d8-9e3e-9f2f17b0c022', 'Cherry Tomatoes', 60, 'g'),
('11c6dca4-2a41-48d8-9e3e-9f2f17b0c022', 'Olive Oil', 10, 'ml'),
('11c6dca4-2a41-48d8-9e3e-9f2f17b0c022', 'Basil', 3, 'leaves'),

-- Zucchine Blossom & Ricotta
('223b6f5a-82d9-4cc4-a84d-2cb1ff7398ef', 'Ricotta', 80, 'g'),
('223b6f5a-82d9-4cc4-a84d-2cb1ff7398ef', 'Mozzarella', 100, 'g'),
('223b6f5a-82d9-4cc4-a84d-2cb1ff7398ef', 'Zucchini Blossoms', 40, 'g'),
('223b6f5a-82d9-4cc4-a84d-2cb1ff7398ef', 'Olive Oil', 10, 'ml'),

-- Piennolo Tomato & Bufala
('9dfc9d1a-63c2-4a4a-96ea-715f62e6f3b3', 'Piennolo Tomatoes', 90, 'g'),
('9dfc9d1a-63c2-4a4a-96ea-715f62e6f3b3', 'Buffalo Mozzarella', 100, 'g'),
('9dfc9d1a-63c2-4a4a-96ea-715f62e6f3b3', 'Basil', 3, 'leaves'),
('9dfc9d1a-63c2-4a4a-96ea-715f62e6f3b3', 'Olive Oil', 10, 'ml'),

-- Porcini & Smoked Provola
('5a18e9b1-52da-4f29-b22a-582a431b00a9', 'Mozzarella', 80, 'g'),
('5a18e9b1-52da-4f29-b22a-582a431b00a9', 'Smoked Provola', 60, 'g'),
('5a18e9b1-52da-4f29-b22a-582a431b00a9', 'Porcini Mushrooms', 50, 'g'),
('5a18e9b1-52da-4f29-b22a-582a431b00a9', 'Olive Oil', 10, 'ml'),

-- Nduja & Burrata
('eab4de3d-8f52-4f4a-b90f-30cf0a01e3b8', 'Tomato Sauce', 70, 'g'),
('eab4de3d-8f52-4f4a-b90f-30cf0a01e3b8', 'Mozzarella', 100, 'g'),
('eab4de3d-8f52-4f4a-b90f-30cf0a01e3b8', 'Nduja', 30, 'g'),
('eab4de3d-8f52-4f4a-b90f-30cf0a01e3b8', 'Burrata', 80, 'g'),
('eab4de3d-8f52-4f4a-b90f-30cf0a01e3b8', 'Basil', 3, 'leaves'),

-- Carbonara Style
('b13d6794-0b6e-4780-83ab-8fbb14563e17', 'Mozzarella', 100, 'g'),
('b13d6794-0b6e-4780-83ab-8fbb14563e17', 'Pancetta', 50, 'g'),
('b13d6794-0b6e-4780-83ab-8fbb14563e17', 'Egg', 1, 'unit'),
('b13d6794-0b6e-4780-83ab-8fbb14563e17', 'Pecorino Romano', 20, 'g'),
('b13d6794-0b6e-4780-83ab-8fbb14563e17', 'Cream', 20, 'ml'),

-- Tartufo Bianco
('d04d5a7b-4c6a-4877-810a-7e998c4de922', 'White Truffle Cream', 50, 'g'),
('d04d5a7b-4c6a-4877-810a-7e998c4de922', 'Mozzarella', 100, 'g'),
('d04d5a7b-4c6a-4877-810a-7e998c4de922', 'White Truffle Oil', 5, 'ml'),

-- Mediterranea
('cfaeb528-9d12-4b18-bae5-274c43bcb173', 'Tomato Sauce', 80, 'g'),
('cfaeb528-9d12-4b18-bae5-274c43bcb173', 'Cherry Tomatoes', 50, 'g'),
('cfaeb528-9d12-4b18-bae5-274c43bcb173', 'Black Olives', 20, 'g'),
('cfaeb528-9d12-4b18-bae5-274c43bcb173', 'Capers', 10, 'g'),
('cfaeb528-9d12-4b18-bae5-274c43bcb173', 'Oregano', 1, 'g'),
('cfaeb528-9d12-4b18-bae5-274c43bcb173', 'Olive Oil', 10, 'ml');

