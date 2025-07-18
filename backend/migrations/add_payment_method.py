"""Add payment_method column to orders table"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    # Add payment_method column to orders table
    op.add_column('orders', sa.Column('payment_method', sa.String(50), nullable=True))

def downgrade():
    # Remove payment_method column from orders table
    op.drop_column('orders', 'payment_method') 