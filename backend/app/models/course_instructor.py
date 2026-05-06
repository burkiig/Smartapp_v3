from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.connection import Base


def _utcnow():
    return datetime.now(timezone.utc)


class CourseInstructor(Base):
    """Many-to-many köprüsü: bir derse birden fazla öğretmen atanabilir.

    Yetkilendirme için tek kaynak (authoritative).
    Course.instructor_id alanı geriye dönük uyumluluk + bildirim kısayolu olarak korunur.
    """

    __tablename__ = "course_instructors"
    __table_args__ = (
        UniqueConstraint("course_id", "instructor_id", name="uq_course_instructor"),
    )

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    added_at = Column(DateTime(timezone=True), default=_utcnow)

    course = relationship("Course", back_populates="course_instructors")
    instructor = relationship("User")
