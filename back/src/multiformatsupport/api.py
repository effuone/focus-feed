from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from .memory import get_memory
from .services import (process_file, process_youtube_url,
                       summarize_with_openai_and_memory)

router = APIRouter()


@router.post("/submit")
async def submit(
    files: List[UploadFile] = File(None),
    youtube_url: str = Form(None),
    memory = Depends(get_memory)
):
    if files:
        # Handle file uploads
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

    elif youtube_url:
        # Handle YouTube URL
        if "youtube.com/watch" not in youtube_url:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        try:
            video_summary = summarize_with_openai_and_memory(youtube_url, memory)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")
        
        return video_summary

    else:
        raise HTTPException(status_code=400, detail="No files or URL provided")
    
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