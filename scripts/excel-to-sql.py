"""
Excel to SQL Converter for Bulk Recipe Insert
Converts Excel file to SQL INSERT statements

Usage:
    python excel-to-sql.py Gourmet_Pizza_Sauces.xlsx

Requirements:
    pip install pandas openpyxl
"""

import pandas as pd
import sys
import os

def excel_to_sql(excel_file, output_file=None):
    """
    Convert Excel file to SQL INSERT statements
    
    Expected Excel columns:
    - Name (required)
    - Description (optional)
    - Difficulty (required: easy, medium, hard)
    - Prep Time (minutes, optional)
    - Cook Time (minutes, optional)
    - Servings (optional)
    - Category (optional, defaults to 'Sauce')
    - Instructions (optional)
    - Image URL (optional)
    """
    
    if not os.path.exists(excel_file):
        print(f"Error: File '{excel_file}' not found!")
        return
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        
        # Convert column names to lowercase and replace spaces with underscores
        df.columns = df.columns.str.lower().str.strip().str.replace(' ', '_')
        
        # Generate SQL
        sql_statements = []
        sql_statements.append("-- Auto-generated SQL from Excel file")
        sql_statements.append(f"-- Source: {excel_file}\n")
        sql_statements.append("BEGIN;\n")
        
        for idx, row in df.iterrows():
            # Get values with defaults
            name = escape_sql_string(str(row.get('name', '')))
            description = escape_sql_string(row.get('description', '')) if pd.notna(row.get('description')) else 'NULL'
            difficulty = str(row.get('difficulty', 'easy')).lower()
            
            # Validate difficulty
            if difficulty not in ['easy', 'medium', 'hard']:
                print(f"Warning: Row {idx + 2}: Invalid difficulty '{difficulty}', defaulting to 'easy'")
                difficulty = 'easy'
            
            prep_time = row.get('prep_time', row.get('prep_time_minutes', 0)) if pd.notna(row.get('prep_time', row.get('prep_time_minutes'))) else 'NULL'
            cook_time = row.get('cook_time', row.get('cook_time_minutes', 0)) if pd.notna(row.get('cook_time', row.get('cook_time_minutes'))) else 'NULL'
            servings = row.get('servings', 0) if pd.notna(row.get('servings')) else 'NULL'
            category = escape_sql_string(row.get('category', 'Sauce')) if pd.notna(row.get('category')) else "'Sauce'"
            instructions = escape_sql_string(row.get('instructions', '')) if pd.notna(row.get('instructions')) else 'NULL'
            image_url = escape_sql_string(row.get('image_url', '')) if pd.notna(row.get('image_url')) else 'NULL'
            
            # Handle numeric values
            if prep_time != 'NULL':
                prep_time = int(float(prep_time))
            if cook_time != 'NULL':
                cook_time = int(float(cook_time))
            if servings != 'NULL':
                servings = int(float(servings))
            
            # Build SQL INSERT statement
            sql = f"""INSERT INTO recipes (name, description, difficulty, prep_time_minutes, cook_time_minutes, servings, category, instructions, image_url)
VALUES (
  '{name}',
  {description if description != 'NULL' else 'NULL'},
  '{difficulty}',
  {prep_time if prep_time != 'NULL' else 'NULL'},
  {cook_time if cook_time != 'NULL' else 'NULL'},
  {servings if servings != 'NULL' else 'NULL'},
  {category},
  {instructions if instructions != 'NULL' else 'NULL'},
  {image_url if image_url != 'NULL' else 'NULL'}
);"""
            
            sql_statements.append(sql)
            sql_statements.append("")  # Empty line for readability
        
        sql_statements.append("COMMIT;")
        
        # Write to file or print
        sql_content = "\n".join(sql_statements)
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(sql_content)
            print(f"✅ SQL file generated: {output_file}")
            print(f"   {len(df)} recipes converted")
        else:
            print(sql_content)
            
    except Exception as e:
        print(f"Error processing Excel file: {e}")
        import traceback
        traceback.print_exc()


def escape_sql_string(value):
    """Escape single quotes in SQL strings"""
    if pd.isna(value):
        return 'NULL'
    return str(value).replace("'", "''")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python excel-to-sql.py <excel_file> [output_file.sql]")
        print("\nExample:")
        print("  python excel-to-sql.py Gourmet_Pizza_Sauces.xlsx output.sql")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    excel_to_sql(excel_file, output_file)

