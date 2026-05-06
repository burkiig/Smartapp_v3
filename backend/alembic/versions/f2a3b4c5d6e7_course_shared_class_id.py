"""Add shared_class_id to courses for parallel course support

Revision ID: f2a3b4c5d6e7
Revises: e1f2a3b4c5d6
Create Date: 2026-05-06 16:00:00.000000

Yapılan değişiklik:
  courses tablosuna nullable Integer kolonu shared_class_id eklendi.

  Amaç — Paralel Ders Desteği:
    Farklı bölümlerden öğrenciler aynı fiziksel dersi farklı ders kodlarıyla
    alabilirler (örn: CMPE321 ve CMSE322 aynı sınıfta, aynı öğretmen).
    Her iki dersin shared_class_id = <ortak değer> olarak atanmasıyla
    yoklama tek seferde tüm paralel gruba uygulanır.

  NULL → bağımsız ders (varsayılan, geriye dönük uyumlu).
  Pozitif integer → paralel grubun grup kimliği.
  Grup kimliği sistem tarafından otomatik üretilmez; admin/API atar.

  İdempotent: kolon zaten varsa tekrar eklemez.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "f2a3b4c5d6e7"
down_revision: Union[str, None] = "e1f2a3b4c5d6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    existing_cols = {col["name"] for col in inspector.get_columns("courses")}
    if "shared_class_id" not in existing_cols:
        op.add_column(
            "courses",
            sa.Column("shared_class_id", sa.Integer(), nullable=True),
        )

    existing_indexes = {idx["name"] for idx in inspector.get_indexes("courses")}
    if "ix_courses_shared_class_id" not in existing_indexes:
        op.create_index(
            "ix_courses_shared_class_id",
            "courses",
            ["shared_class_id"],
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    existing_indexes = {idx["name"] for idx in inspector.get_indexes("courses")}
    if "ix_courses_shared_class_id" in existing_indexes:
        op.drop_index("ix_courses_shared_class_id", table_name="courses")

    existing_cols = {col["name"] for col in inspector.get_columns("courses")}
    if "shared_class_id" in existing_cols:
        op.drop_column("courses", "shared_class_id")
