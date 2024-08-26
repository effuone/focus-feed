import os
import re
from typing import Dict, List
from pydantic import BaseModel
import fitz
from fastapi import UploadFile, APIRouter, File, HTTPException
from unsplash.api import Api
from unsplash.auth import Auth

import json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

unsplash_auth = Auth(
    os.environ.get("UNSPLASH_ACCESS_KEY"),
    os.environ.get("UNSPLASH_SECRET_KEY"),
    os.environ.get("UNSPLASH_REDIRECT_URI")
)
unsplash_api = Api(unsplash_auth)


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
    
class BookContent(BaseModel):
    content: str

class VideoData(BaseModel):
    summary: str
    title: str
    backgroundColor: str
    textColor: str
    fontFamily: str
    intro: Dict
    scenes: List[Dict]
    outro: Dict
    
def search_image(query):
    try:
        results = unsplash_api.search.photos(query, per_page=1)
        if results and results['results']:
            return results['results'][0].urls.regular
    except Exception as e:
        print(f"Error searching for image: {e}")
    return None

@router.post("/generate-video-data", response_model=VideoData)
async def generate_video_data(book_content: BookContent):
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": f"Generate a video structure for the following book content:\n\n{book_content.content}"}
    ]

    functions = [
        {
            "name": "generate_video_structure",
            "description": "Generates a video structure based on the given book content",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {"type": "string", "description": "A concise summary of the chapter"},
                    "title": {"type": "string", "description": "Title of the video"},
                    "backgroundColor": {"type": "string", "description": "Background color in hex format"},
                    "textColor": {"type": "string", "description": "Text color in hex format"},
                    "fontFamily": {"type": "string", "description": "Font family name"},
                    "intro": {
                        "type": "object",
                        "properties": {
                            "durationInSeconds": {"type": "number"},
                            "content": {
                                "type": "object",
                                "properties": {
                                    "heading": {"type": "string"},
                                    "subheading": {"type": "string"}
                                }
                            },
                            "voiceover": {"type": "string"},
                            "animation": {
                                "type": "object",
                                "properties": {
                                    "type": {"type": "string"},
                                    "durationInSeconds": {"type": "number"}
                                }
                            },
                            "style": {"type": "object"}
                        }
                    },
                    "scenes": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "description": {"type": "string"},
                                "image": {"type": "string"},
                                "durationInSeconds": {"type": "number"},
                                "voiceover": {"type": "string"},
                                "animation": {
                                    "type": "object",
                                    "properties": {
                                        "type": {"type": "string"},
                                        "durationInSeconds": {"type": "number"}
                                    }
                                },
                                "style": {"type": "object"},
                                "imageSearchKeywords": {"type": "string"}  
                            }
                        }
                    },
                    "outro": {
                        "type": "object",
                        "properties": {
                            "durationInSeconds": {"type": "number"},
                            "content": {
                                "type": "object",
                                "properties": {
                                    "heading": {"type": "string"},
                                    "subheading": {"type": "string"}
                                }
                            },
                            "voiceover": {"type": "string"},
                            "animation": {
                                "type": "object",
                                "properties": {
                                    "type": {"type": "string"},
                                    "durationInSeconds": {"type": "number"}
                                }
                            },
                            "style": {"type": "object"}
                        }
                    }
                },
                "required": ["summary", "title", "backgroundColor", "textColor", "fontFamily", "intro", "scenes", "outro"]
            }
        }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=messages,
            functions=functions,
            function_call={"name": "generate_video_structure"}
        )

        function_call = response.choices[0].message.function_call
        if function_call and function_call.arguments:
            video_data = json.loads(function_call.arguments)
            
            for scene in video_data['scenes']:
                image_query = scene.get('imageSearchKeyword', f"{video_data['title']} {scene['title']}")
                image_url = search_image(image_query)
                if image_url:
                    scene['image'] = image_url
            
            return VideoData(**video_data)
        else:
            raise HTTPException(status_code=500, detail="Failed to generate video data")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    
    
prompt = """
You are a creative assistant tasked with transforming a chapter from a book into a detailed JSON structure that will be used to create a video. The video should include an introduction, multiple scenes, and an outro, with each scene representing a key concept or part of the chapter. Each part should include animations, voiceovers, appropriate styles, and suggest a single keyword for image searches based on the content of each scene.

Additionally, provide a concise summary of the chapter that captures its main ideas and themes.

Given the following book chapter content:

Generate a JSON object in the following format:

{
"summary": "A concise summary of the chapter",
"backgroundColor": "#hexcolor",
"textColor": "#hexcolor",
"fontFamily": "font-family-name",
"intro": {
    "durationInSeconds": 5,
    "content": {
    "heading": "Intro Heading",
    "subheading": "Intro Subheading"
    },
    "voiceover": "Voiceover text for the intro.",
    "animation": {
    "type": "zoom-out",
    "durationInSeconds": 1
    },
    "style": {
    "heading": {
        "fontSize": "60px",
        "fontWeight": "bold",
        "textAlign": "center",
        "marginBottom": "20px"
    },
    "subheading": {
        "fontSize": "30px",
        "textAlign": "center",
        "marginBottom": "10px"
    }
    }
},
"scenes": [
    {
    "title": "Scene Title",
    "description": "Scene Description",
    "image": "Image URL",
    "durationInSeconds": 10,
    "voiceover": "Voiceover text for the scene.",
    "animation": {
        "type": "zoom-out",
        "durationInSeconds": 1
    },
    "style": {
        "title": {
        "fontSize": "50px",
        "fontWeight": "bold",
        "textAlign": "center",
        "marginBottom": "20px"
        },
        "description": {
        "fontSize": "30px",
        "textAlign": "center",
        "marginBottom": "20px"
        },
        "image": {
        "width": "100%",
        "maxWidth": "600px",
        "borderRadius": "10px",
        "margin": "auto"
        }
    },
    "imageSearchKeyword": "Single, specific keyword for high-quality image search"
    },
    // Add more scenes with correspondance to the chapter content
],
"outro": {
    "durationInSeconds": 5,
    "content": {
    "heading": "Outro Heading",
    "subheading": "Outro Subheading"
    },
    "voiceover": "Voiceover text for the outro.",
    "animation": {
    "type": "zoom-out",
    "durationInSeconds": 1
    },
    "style": {
    "heading": {
        "fontSize": "60px",
        "fontWeight": "bold",
        "textAlign": "center",
        "marginBottom": "20px"
    },
    "subheading": {
        "fontSize": "30px",
        "textAlign": "center",
        "marginBottom": "10px"
    }
    }
}
}
Generate this JSON structure by breaking down the chapter into key scenes, summarizing the content for each scene, suggesting animations, styles, and providing keywords for image searches that align with the tone and message of the chapter. Note: do not put in the keywords images from example.com, instead, use the Unsplash API to search for relevant images based on the keywords provided.
Remember to include a concise summary of the chapter and provide a single, specific imageSearchKeyword for each scene that will result in a high-quality, relevant image.
"""