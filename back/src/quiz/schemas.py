from pydantic import BaseModel


class QuizSummaryCreate(BaseModel):
    questions: list[str]
    answers: list[str]


class QuizSummaryResponse(BaseModel):
    summary_text: str
    user_id: int
    id: int