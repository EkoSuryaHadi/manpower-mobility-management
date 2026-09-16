"""create audit events"""
from alembic import op
import sqlalchemy as sa
revision = "0008_create_audit_events"
down_revision = "0007_create_demobilizations"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("audit_events", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("organization_id", sa.String(80), nullable=False), sa.Column("actor_id", sa.String(120), nullable=False), sa.Column("action", sa.String(80), nullable=False), sa.Column("entity_type", sa.String(80), nullable=False), sa.Column("entity_id", sa.String(80), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_audit_events_organization_id", "audit_events", ["organization_id"])
def downgrade():
    op.drop_table("audit_events")
