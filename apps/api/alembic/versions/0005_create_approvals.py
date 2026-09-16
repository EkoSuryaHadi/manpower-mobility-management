"""create approvals"""
from alembic import op
import sqlalchemy as sa
revision = "0005_create_approvals"
down_revision = "0004_create_requirements"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("approvals", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("organization_id", sa.String(80), nullable=False), sa.Column("assignment_id", sa.Integer(), sa.ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False), sa.Column("status", sa.String(30), server_default="pending", nullable=False), sa.Column("comment", sa.String(500)), sa.Column("approved_by", sa.String(120)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_approvals_organization_id", "approvals", ["organization_id"])
    op.create_index("ix_approvals_assignment_id", "approvals", ["assignment_id"])
def downgrade():
    op.drop_table("approvals")
