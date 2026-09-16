"""create demobilizations"""
from alembic import op
import sqlalchemy as sa
revision = "0007_create_demobilizations"
down_revision = "0006_create_mobilizations"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("demobilizations", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("organization_id", sa.String(80), nullable=False), sa.Column("assignment_id", sa.Integer(), sa.ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False), sa.Column("status", sa.String(30), server_default="planned", nullable=False), sa.Column("returned_at", sa.DateTime(timezone=True)), sa.Column("notes", sa.String(500)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_demobilizations_organization_id", "demobilizations", ["organization_id"])
    op.create_index("ix_demobilizations_assignment_id", "demobilizations", ["assignment_id"])
def downgrade():
    op.drop_table("demobilizations")
