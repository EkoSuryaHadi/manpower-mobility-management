"""create mobilizations"""
from alembic import op
import sqlalchemy as sa
revision = "0006_create_mobilizations"
down_revision = "0005_create_approvals"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("mobilizations", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("organization_id", sa.String(80), nullable=False), sa.Column("assignment_id", sa.Integer(), sa.ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False), sa.Column("status", sa.String(30), server_default="planned", nullable=False), sa.Column("departure_at", sa.DateTime(timezone=True)), sa.Column("arrival_at", sa.DateTime(timezone=True)), sa.Column("notes", sa.String(500)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_mobilizations_organization_id", "mobilizations", ["organization_id"])
    op.create_index("ix_mobilizations_assignment_id", "mobilizations", ["assignment_id"])
def downgrade():
    op.drop_table("mobilizations")
