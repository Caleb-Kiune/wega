#!/usr/bin/env python3
"""
Script to fix PostgreSQL sequences for all tables in the database.
This resolves issues where sequences are out of sync with actual data.
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_database_url():
    """Get database URL from environment or use default SQLite"""
    db_url = os.getenv('DATABASE_URL')
    if db_url:
        return db_url
    else:
        # Default SQLite database
        basedir = os.path.abspath(os.path.dirname(__file__))
        return f'sqlite:///{os.path.join(basedir, "app.db")}'

def fix_sequences():
    """Fix sequences for all tables"""
    db_url = get_database_url()
    
    if 'postgresql' in db_url:
        # PostgreSQL specific sequence fixing
        engine = create_engine(db_url)
        
        with engine.connect() as conn:
            # Get all tables with serial/identity columns
            tables_query = """
            SELECT 
                t.table_name,
                c.column_name,
                c.column_default
            FROM information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name
            WHERE t.table_schema = 'public'
            AND t.table_type = 'BASE TABLE'
            AND c.column_default LIKE 'nextval%'
            ORDER BY t.table_name, c.column_name;
            """
            
            result = conn.execute(text(tables_query))
            tables = result.fetchall()
            
            print("Found tables with sequences:")
            for table in tables:
                print(f"  - {table[0]}.{table[1]}")
            
            print("\nFixing sequences...")
            
            for table_name, column_name, column_default in tables:
                try:
                    # Get the sequence name from the default value
                    sequence_name = column_default.split("'")[1] if "'" in column_default else None
                    
                    if sequence_name:
                        # Get the maximum ID value from the table
                        max_id_query = f"SELECT COALESCE(MAX({column_name}), 0) FROM {table_name}"
                        max_result = conn.execute(text(max_id_query))
                        max_id = max_result.scalar()
                        
                        # Set the sequence to the next value after the maximum
                        next_val = max_id + 1
                        fix_query = f"SELECT setval('{sequence_name}', {next_val}, false)"
                        
                        print(f"  Fixing {table_name}.{column_name} (sequence: {sequence_name})")
                        print(f"    Max ID: {max_id}, Next value: {next_val}")
                        
                        conn.execute(text(fix_query))
                        conn.commit()
                        
                        print(f"    ✓ Fixed {sequence_name} to start from {next_val}")
                        
                except Exception as e:
                    print(f"    ✗ Error fixing {table_name}.{column_name}: {e}")
                    conn.rollback()
            
            print("\nSequence fixing completed!")
            
    else:
        # SQLite doesn't use sequences, so no fixing needed
        print("SQLite database detected. No sequence fixing needed.")
        print("SQLite uses auto-incrementing integers which don't have sequence issues.")

if __name__ == "__main__":
    print("Database Sequence Fixer")
    print("=" * 50)
    
    try:
        fix_sequences()
        print("\n✅ All sequences have been fixed successfully!")
        print("\nPlease restart your backend server for the changes to take effect.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1) 