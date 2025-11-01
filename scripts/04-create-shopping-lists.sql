-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2),
  unit TEXT,
  is_checked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list_id ON shopping_list_items(shopping_list_id);

-- Enable RLS
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists" ON shopping_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shopping lists" ON shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists" ON shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists" ON shopping_lists
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for shopping_list_items
CREATE POLICY "Users can view items in their shopping lists" ON shopping_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items in their shopping lists" ON shopping_list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their shopping lists" ON shopping_list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in their shopping lists" ON shopping_list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );


