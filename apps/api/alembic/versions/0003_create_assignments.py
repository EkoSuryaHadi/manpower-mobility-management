"""create assignments"""
from alembic import op
import sqlalchemy as sa
revision = "0003_create_assignments"
down_revision = "0002_create_worker_documents"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("assignments", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("organization_id", sa.String(80), nullable=False), sa.Column("worker_id", sa.Integer(), sa.ForeignKey("workers.id", ondelete="CASCADE"), nullable=False), sa.Column("position", sa.String(120), nullable=False), sa.Column("site", sa.String(160), nullable=False), sa.Column("status", sa.String(30), server_default="draft", nullable=False), sa.Column("starts_at", sa.DateTime(timezone=True)), sa.Column("ends_at", sa.DateTime(timezone=True)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_assignments_organization_id", "assignments", ["organization_id"])
    op.create_index("ix_assignments_worker_id", "assignments", ["worker_id"])
def downgrade():
    op.drop_table("assignments")
