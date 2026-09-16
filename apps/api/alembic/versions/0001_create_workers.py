"""create workers

Revision ID: 0001_create_workers
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_create_workers"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "workers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("employee_number", sa.String(length=50), nullable=False),
        sa.Column("full_name", sa.String(length=160), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_workers_employee_number", "workers", ["employee_number"], unique=True)

def downgrade():
    op.drop_index("ix_workers_employee_number", table_name="workers")
    op.drop_table("workers")
