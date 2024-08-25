from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from .memory import get_memory
from .services import (process_file, process_youtube_url,
                       summarize_with_openai_and_memory)

router = APIRouter()


@router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    memory = Depends(get_memory)
):
    results = []
    for file in files:
        content = await file.read()
        processed_text = await process_file(file.filename, content)
        summary = summarize_with_openai_and_memory(processed_text, memory)
        results.append({
            "filename": file.filename,
            "summary": summary
        })
    return results


@router.post("/process-youtube/")
async def process_youtube(youtube_url: str = Form(...), memory = Depends(get_memory)):
    if "youtube.com/watch" not in youtube_url:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    try:
        transcript_text = process_youtube_url(youtube_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transcript: {str(e)}")

    summary = summarize_with_openai_and_memory(transcript_text, memory)
    return {"youtube_url": youtube_url, "summary": summary}
