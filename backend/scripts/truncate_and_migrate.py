from app import app, db
from models import *
from flask_migrate import upgrade
from sqlalchemy import text
import os

def truncate_all_tables():
    with app.app_context():
        # Disable foreign key checks temporarily
        db.session.execute(text('SET CONSTRAINTS ALL DEFERRED'))
        
        # Get all table names
        tables = db.metadata.tables.keys()
        
        # Truncate each table
        for table in tables:
            db.session.execute(text(f'TRUNCATE TABLE "{table}" CASCADE'))
        
        # Re-enable foreign key checks
        db.session.execute(text('SET CONSTRAINTS ALL IMMEDIATE'))
        
        # Commit the changes
        db.session.commit()

def run_migrations():
    with app.app_context():
        # Run all migrations
        upgrade()

if __name__ == '__main__':
    print("Truncating all tables...")
    truncate_all_tables()
    print("Tables truncated successfully!")
    
    print("\nRunning migrations...")
    run_migrations()
    print("Migrations completed successfully!") 