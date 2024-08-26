from app.db import get_async_db
from auth.dependencies import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User
from .schemas import QuizSummaryCreate, QuizSummaryResponse
from .services import save_summary, summarize_text

router = APIRouter()

@router.post("/summarize", response_model=QuizSummaryResponse)
async def summarize_quiz(
    summary_data: QuizSummaryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):

    combined_text = "\n".join(
        f"Q: {question}\nA: {answer}"
        for question, answer in zip(summary_data.questions, summary_data.answers)
    )
    summary = await summarize_text(combined_text)
    saved_summary = await save_summary(db, current_user.id, summary)
    return saved_summary