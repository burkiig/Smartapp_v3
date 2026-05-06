"""Add course_instructors join table for many-to-many instructor support

Revision ID: g3h4i5j6k7l8
Revises: f2a3b4c5d6e7
Create Date: 2026-05-06 16:30:00.000000

Yapılan değişiklik:
  course_instructors join tablosu oluşturuldu.
  Mevcut courses.instructor_id verileri bu tabloya taşındı (data migration).

  Mimari kararlar:
    - courses.instructor_id KORUNUR: geriye dönük uyumluluk + bildirim kısayolu.
    - Yetkilendirme ("Bu öğretmen bu dersin hocası mı?") course_instructors üzerinden yapılır.
    - Varolan her courses.instructor_id != NULL kaydı course_instructors'a INSERT edilir.
    - ondelete="CASCADE": ders silinirse öğretmen atamaları otomatik temizlenir.

  Geriye dönük uyumluluk:
    - Eski kayıtlarda instructor_id NULL ise course_instructors'ta da giriş olmaz.
    - Uygulama kademeli olarak course_instructors'a geçerken NULL durumu
      fallback olarak instructor_id'yi kullanmaya devam eder.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "g3h4i5j6k7l8"
down_revision: Union[str, None] = "f2a3b4c5d6e7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = inspector.get_table_names()

    # ── Tablo oluştur (idempotent) ────────────────────────────────────────────
    if "course_instructors" not in existing_tables:
        op.create_table(
            "course_instructors",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("course_id", sa.Integer(), nullable=False),
            sa.Column("instructor_id", sa.Integer(), nullable=False),
            sa.Column(
                "added_at",
                sa.DateTime(timezone=True),
                nullable=True,
                server_default=sa.text("CURRENT_TIMESTAMP"),
            ),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("course_id", "instructor_id", name="uq_course_instructor"),
        )
        op.create_index("ix_course_instructors_course_id", "course_instructors", ["course_id"])
        op.create_index(
            "ix_course_instructors_instructor_id", "course_instructors", ["instructor_id"]
        )

        # PostgreSQL: gerçek FK kısıtları (CASCADE)
        if bind.dialect.name == "postgresql":
            op.create_foreign_key(
                "fk_ci_course_id",
                "course_instructors", "courses",
                ["course_id"], ["id"], ondelete="CASCADE",
            )
            op.create_foreign_key(
                "fk_ci_instructor_id",
                "course_instructors", "users",
                ["instructor_id"], ["id"], ondelete="CASCADE",
            )

    # ── Data migration: mevcut instructor_id → course_instructors ─────────────
    # ON CONFLICT DO NOTHING: idempotent (migration iki kez çalışsa da sorun olmaz)
    if bind.dialect.name == "postgresql":
        bind.execute(sa.text("""
            INSERT INTO course_instructors (course_id, instructor_id)
            SELECT id, instructor_id FROM courses
            WHERE instructor_id IS NOT NULL
            ON CONFLICT (course_id, instructor_id) DO NOTHING
        """))
    else:
        # SQLite: INSERT OR IGNORE
        bind.execute(sa.text("""
            INSERT OR IGNORE INTO course_instructors (course_id, instructor_id)
            SELECT id, instructor_id FROM courses
            WHERE instructor_id IS NOT NULL
        """))


def downgrade() -> None:
    bind = op.get_bind()

    if bind.dialect.name == "postgresql":
        op.drop_constraint("fk_ci_instructor_id", "course_instructors", type_="foreignkey")
        op.drop_constraint("fk_ci_course_id", "course_instructors", type_="foreignkey")

    op.drop_index("ix_course_instructors_instructor_id", table_name="course_instructors")
    op.drop_index("ix_course_instructors_course_id", table_name="course_instructors")
    op.drop_table("course_instructors")
