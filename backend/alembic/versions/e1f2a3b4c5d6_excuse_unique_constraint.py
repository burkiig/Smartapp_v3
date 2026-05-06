"""Add unique constraint on excuses(student_id, session_id)

Revision ID: e1f2a3b4c5d6
Revises: d4e5f6a7b8c9
Create Date: 2026-05-06 15:00:00.000000

Yapılan değişiklik:
  excuses tablosuna (student_id, session_id) çifti üzerinde unique constraint eklendi.
  Böylece bir öğrenci aynı oturum için birden fazla mazeret giremez.

  session_id NULL olan mazeretler (oturum bağlantısız) bu kısıttan etkilenmez;
  NULL değerler unique constraint'te eşit sayılmaz (SQL standardı).
  Oturumsuz duplicate'ler uygulama katmanında (course_id + session_date) kontrol edilir.

  Geriye dönük uyumluluk:
    - upgrade() çalışmadan önce varsa mevcut duplicate'ler temizlenir (en yeni kaydı tutar).
    - İdempotent: kısıt zaten varsa tekrar eklemez.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "e1f2a3b4c5d6"
down_revision: Union[str, None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    existing_constraints = {
        uc["name"] for uc in inspector.get_unique_constraints("excuses")
    }

    if "uq_excuse_student_session" not in existing_constraints:
        # Mevcut duplicate'leri temizle: aynı (student_id, session_id) için
        # en yüksek id'li (en son eklenen) kaydı tut, diğerlerini sil.
        # session_id NULL olanlar bu temizlikten etkilenmez.
        if bind.dialect.name == "postgresql":
            bind.execute(sa.text("""
                DELETE FROM excuses
                WHERE id NOT IN (
                    SELECT MAX(id)
                    FROM excuses
                    WHERE session_id IS NOT NULL
                    GROUP BY student_id, session_id
                )
                AND session_id IS NOT NULL
            """))
        else:
            # SQLite
            bind.execute(sa.text("""
                DELETE FROM excuses
                WHERE id NOT IN (
                    SELECT MAX(id)
                    FROM excuses
                    WHERE session_id IS NOT NULL
                    GROUP BY student_id, session_id
                )
                AND session_id IS NOT NULL
            """))

        op.create_unique_constraint(
            "uq_excuse_student_session",
            "excuses",
            ["student_id", "session_id"],
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    existing_constraints = {
        uc["name"] for uc in inspector.get_unique_constraints("excuses")
    }
    if "uq_excuse_student_session" in existing_constraints:
        op.drop_constraint("uq_excuse_student_session", "excuses", type_="unique")
