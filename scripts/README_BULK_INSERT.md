# Quick Start: Bulk Insert Sauces from Excel

## Option 1: Use Python Script (Easiest)

1. **Install required packages:**
   ```bash
   pip install pandas openpyxl
   ```

2. **Run the converter:**
   ```bash
   python scripts/excel-to-sql.py Gourmet_Pizza_Sauces.xlsx sauces.sql
   ```

3. **Copy the generated SQL** (`sauces.sql`) and paste it into Supabase SQL Editor

4. **Run in Supabase:**
   - Go to Supabase Dashboard → SQL Editor
   - Paste the SQL
   - Click Run

## Option 2: Manual SQL (If Excel has these columns)

If your Excel file has columns like:
- **Name** (required)
- **Difficulty** (required: easy/medium/hard)
- **Description** (optional)
- **Prep Time** or **Prep Time Minutes** (optional)
- **Cook Time** or **Cook Time Minutes** (optional)
- **Servings** (optional)
- **Category** (optional, defaults to "Sauce")
- **Instructions** (optional)
- **Image URL** (optional)

Then use this template:

```sql
INSERT INTO recipes (name, description, difficulty, prep_time_minutes, cook_time_minutes, servings, category, instructions)
VALUES
  ('Sauce Name 1', 'Description here', 'easy', 10, 20, 4, 'Sauce', 'Step 1\nStep 2'),
  ('Sauce Name 2', 'Another description', 'medium', 15, 30, 6, 'Sauce', 'Instructions here');
```

## Option 3: Direct Supabase Import

1. Export Excel to CSV
2. Go to Supabase Dashboard → Table Editor → recipes
3. Click "Insert" → "Import data from CSV"
4. Map columns manually

---

**For detailed instructions, see `BULK_INSERT_GUIDE.md`**

