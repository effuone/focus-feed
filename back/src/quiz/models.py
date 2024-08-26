from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..app.db import Base
from ..app.models import User


class QuizSummary(Base):
    __tablename__ = "quiz_summaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    summary_text = Column(String, nullable=False)

    user = relationship("User", back_populates="summaries")


User.summaries = relationship("QuizSummary", back_populates="user")