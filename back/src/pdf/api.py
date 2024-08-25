from http.client import HTTPException
import re
import fitz
from fastapi import UploadFile, APIRouter, File

router = APIRouter()

def is_potential_chapter_heading(text, font_size, page_number):
    # Example heuristic checks:
    if page_number <= 2:  # Exclude first few pages
        return False

    if font_size < 16:  # Example font size threshold
        return False

    if any(keyword in text.lower() for keyword in ["chapter", "part", "section", "prologue", "epilogue"]):
        return True
    
    # Check for patterns like "1:", "I.", "Chapter 1", etc.
    if re.match(r'^[0-9]+[:.]*\s', text) or re.match(r'^[IVXLCDM]+\s', text):
        return True

    return False

def extract_chapter_contents(doc, chapters):
    for i in range(len(chapters)):
        start_page = chapters[i]["page"] - 1  # Page numbering in `fitz` starts from 0
        end_page = chapters[i + 1]["page"] - 1 if i + 1 < len(chapters) else len(doc) - 1

        content = ""
        for page_num in range(start_page, end_page + 1):
            page = doc[page_num]
            blocks = page.get_text("dict")["blocks"]
            for block in blocks:
                for line in block["lines"]:
                    for span in line["spans"]:
                        text = span["text"].strip()
                        if text != chapters[i]["header"]:  # Exclude the header itself
                            content += text + " "

        chapters[i]["content"] = content.strip()

    return chapters

def identify_chapter_headers(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    chapters = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        blocks = page.get_text("dict")["blocks"]

        for block in blocks:
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"].strip()
                    font_size = span["size"]
                    bbox = line["bbox"]

                    if is_potential_chapter_heading(text, font_size, page_num + 1):
                        chapters.append({
                            "page": page_num + 1,
                            "header": text,
                            "font_size": font_size,
                            "bbox": bbox
                        })

    # Extract content for each chapter
    chapters = extract_chapter_contents(doc, chapters)

    return chapters

@router.post("/extract-chapters")
async def extract_chapters(file: UploadFile = File(...)):
    try:
        # Read the uploaded PDF file
        pdf_bytes = await file.read()

        # Identify chapter headers and their corresponding content
        chapters = identify_chapter_headers(pdf_bytes)

        return {"chapters": chapters}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
