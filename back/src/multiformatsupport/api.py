from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_async_db
from app.models import User
from auth.dependencies import get_current_user
from .memory import get_memory
from .services import (process_file, summarize_with_openai_and_memory,
                       summarize_with_openai_and_memory_files)

router = APIRouter()


@router.post("/submit")
async def submit(
    files: List[UploadFile] = File(None),
    youtube_url: str = Form(None),
    memory = Depends(get_memory),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    results = []

    # Retrieve the user's quiz summaries
    quiz_summaries = current_user.summaries
    combined_quiz_summary = "\n\n".join([summary.summary_text for summary in quiz_summaries])

    # Process files
    if files:
        for file in files:
            content = await file.read()
            processed_text = await process_file(file.filename, content)

            # Combine the user's quiz summaries with the processed file content
            combined_text = f"{combined_quiz_summary}\n\n{processed_text}"
            summary = summarize_with_openai_and_memory_files(combined_text, memory)
            results.append({
                "filename": file.filename,
                "summary": summary
            })

    return results


@router.post("/upload")
async def process_youtube(
    url: str = Form(...),
    contentType: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),  # Make files optional
    memory = Depends(get_memory)
):
    if contentType == "url" and "youtube.com/watch" in url:
        try:
            video_summary = summarize_with_openai_and_memory(url, memory)
            return video_summary
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Invalid content type or YouTube URL")