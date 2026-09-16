"""create requirements"""
from alembic import op
import sqlalchemy as sa
revision = "0004_create_requirements"
down_revision = "0003_create_assignments"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("requirements", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("organization_id", sa.String(80), nullable=False), sa.Column("position", sa.String(120), nullable=False), sa.Column("site", sa.String(160), server_default="*", nullable=False), sa.Column("document_type", sa.String(50), nullable=False), sa.Column("active", sa.Boolean(), server_default=sa.true(), nullable=False))
    op.create_index("ix_requirements_organization_id", "requirements", ["organization_id"])
    op.create_index("ix_requirements_position", "requirements", ["position"])
def downgrade():
    op.drop_table("requirements")
