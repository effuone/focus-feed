from typing import List

from fastapi import APIRouter, Depends, File, UploadFile

from .memory import get_memory
from .services import process_file, summarize_with_openai_and_memory

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
