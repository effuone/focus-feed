import os

from openai import OpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from .models import QuizSummary

openai = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))


async def summarize_text(text: str) -> str:
    messages = [
        {
            "role": "system",
            "content": "You are ChatGPT, a sophisticated language model trained by OpenAI. Your role is to process quiz-related content and generate detailed, structured summaries that capture all essential elements, including the questions, options, and explanations provided. Ensure that the summary is clear, concise, and organized into coherent paragraphs, accurately reflecting the key points and any nuances of the quiz material."
        },
        {
            "role": "user",
            "content": f"Please summarize the following quiz content in detail. The summary should include an overview of the questions, the options presented, and any explanations or additional context provided in the quiz. Organize the summary into clear paragraphs that cover all relevant details while maintaining the original intent and emphasis of the content.Do a little summarize for profile of user and known which types content user prefer.\n\n{text}"
        }
    ]

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    summary = response.choices[0].message.content.strip()
    return summary


async def save_summary(db: AsyncSession, user_id: int, summary: str) -> QuizSummary:
    new_summary = QuizSummary(user_id=user_id, summary_text=summary)
    db.add(new_summary)
    await db.commit()
    await db.refresh(new_summary)
    return new_summary
