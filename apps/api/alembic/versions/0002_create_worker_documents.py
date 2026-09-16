"""create worker documents"""
from alembic import op
import sqlalchemy as sa
revision = "0002_create_worker_documents"
down_revision = "0001_create_workers"
branch_labels = None
depends_on = None
def upgrade():
    op.create_table("worker_documents", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("worker_id", sa.Integer(), sa.ForeignKey("workers.id", ondelete="CASCADE"), nullable=False), sa.Column("organization_id", sa.String(80), nullable=False), sa.Column("document_type", sa.String(50), nullable=False), sa.Column("file_name", sa.String(255), nullable=False), sa.Column("object_key", sa.String(500), nullable=False), sa.Column("status", sa.String(30), server_default="pending", nullable=False), sa.Column("expires_at", sa.DateTime(timezone=True)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_worker_documents_worker_id", "worker_documents", ["worker_id"])
    op.create_index("ix_worker_documents_organization_id", "worker_documents", ["organization_id"])
    op.create_unique_constraint("uq_worker_documents_object_key", "worker_documents", ["object_key"])
def downgrade():
    op.drop_table("worker_documents")
