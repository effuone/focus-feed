import io
import json
import mimetypes
import os
import subprocess
from typing import Dict, List

import PyPDF2
import pytesseract
import speech_recognition as sr
from app.config import settings
from langchain.schema import AIMessage, HumanMessage
from openai import OpenAI
from PIL import Image
from pydub import AudioSegment
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube

<<<<<<< HEAD
from openai import OpenAI

from app.config import settings

openai.api_key = settings.openai_api_key
=======
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)
>>>>>>> main

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

AudioSegment.converter = "ffmpeg"
AudioSegment.ffmpeg = "ffmpeg"
AudioSegment.ffprobe = "ffprobe"


async def process_file(filename, content):
    mime_type, _ = mimetypes.guess_type(filename)
    
    if mime_type == 'application/pdf':
        return process_pdf(content)
    elif mime_type in ['audio/mpeg', 'audio/mp3'] or (mime_type and mime_type.startswith('audio/')):
        return process_audio(content, mime_type)
    elif mime_type and mime_type.startswith('video/'):
        return process_video(content)
    elif mime_type and mime_type.startswith('text/'):
        return content.decode('utf-8')
    elif mime_type and mime_type.startswith('image/'):
        return process_image(content)
    else:
        raise ValueError(f"Unsupported file type: {mime_type}")


def process_pdf(content):
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text


def process_audio(content, mime_type):
    try:
        format = mime_type.split('/')[-1] if mime_type else 'raw'
        input_path = '/tmp/input_audio'
        output_path = '/tmp/output_audio.wav'

        with open(input_path, 'wb') as f:
            f.write(content)

        result = subprocess.run(
            ['ffmpeg', '-y', '-i', input_path, '-f', 'wav', output_path],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )

        if result.returncode != 0:
            print("FFmpeg failed with the following error output:")
            print(result.stderr.decode())
            return "Failed to decode audio file"

        with open(output_path, 'rb') as wav_file:
            audio = wav_file.read()
            recognizer = sr.Recognizer()
            with sr.AudioFile(io.BytesIO(audio)) as source:
                audio_data = recognizer.record(source)

            try:
                return recognizer.recognize_google(audio_data)
            except sr.UnknownValueError:
                return "Audio could not be understood"
            except sr.RequestError as e:
                return f"Could not request results from the speech recognition service: {e}"

    except Exception as e:
        print(f"Failed to process audio: {e}")
        return f"Failed to process audio: {e}"

    finally:
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)


def process_video(content):
    return process_audio(content, 'audio/mp4')


def process_image(content):
    image = Image.open(io.BytesIO(content))
    text = pytesseract.image_to_string(image)
    return text if text.strip() else "No text could be extracted from the image"


def process_youtube_url(youtube_url: str) -> List[Dict[str, str]]:
    video_id = youtube_url.split("v=")[1].split("&")[0]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    
    # Structure the transcript with timecodes
    structured_transcript = [
        {
            'timestamp': format_time(entry['start']),
            'text': entry['text']
        }
        for entry in transcript
<<<<<<< HEAD
    ]
    
    return structured_transcript

def format_time(seconds: float) -> str:
    minutes, seconds = divmod(int(seconds), 60)
    hours, minutes = divmod(minutes, 60)
    if hours > 0:
        return f"{hours:02}:{minutes:02}:{seconds:02}"
    else:
        return f"{minutes:02}:{seconds:02}"

def get_video_details(youtube_url: str) -> Dict[str, str]:
    yt = YouTube(youtube_url)
    video_details = {
        "videoName": yt.title,
        "authorName": yt.author,
        "duration": format_time(yt.length)  # yt.length returns duration in seconds
    }
    return video_details

def summarize_with_openai_and_memory(youtube_url: str, memory) -> Dict[str, any]:
    transcript_with_timecodes = process_youtube_url(youtube_url)
    transcript_text = "\n".join([entry['text'] for entry in transcript_with_timecodes])
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant that provides detailed summaries of text."},
        {"role": "user", "content": f"Please summarize the following text in detail:\n\n{text}"}
        {"role": "system", "content": (
            "You are an advanced language model and assistant capable of analyzing, summarizing, and extracting key information from text. "
            "Your task is to provide concise, accurate, and insightful summaries of complex content, while also identifying and highlighting "
            "the most important points and insights. You should ensure that the summary is clear and easy to understand, even for someone who "
            "may not be familiar with the original content. Additionally, you should format the summary in a way that is engaging and informative, "
            "using bullet points or numbered lists where appropriate to organize the information. Please also ensure that any technical jargon "
            "is explained or simplified to make the content accessible to a broad audience."
        )},
        {"role": "user", "content": f"Please summarize the following text:\n\n{transcript_text}"}
=======
>>>>>>> main
    ]
    
    return structured_transcript

def format_time(seconds: float) -> str:
    minutes, seconds = divmod(int(seconds), 60)
    hours, minutes = divmod(minutes, 60)
    if hours > 0:
        return f"{hours:02}:{minutes:02}:{seconds:02}"
    else:
        return f"{minutes:02}:{seconds:02}"

def get_video_details(youtube_url: str) -> Dict[str, str]:
    yt = YouTube(youtube_url)
    video_details = {
        "videoName": yt.title,
        "authorName": yt.author,
        "duration": format_time(yt.length)  # yt.length returns duration in seconds
    }
    return video_details

def summarize_with_openai_and_memory(youtube_url: str, memory) -> Dict[str, any]:
    transcript_with_timecodes = process_youtube_url(youtube_url)
    transcript_text = "\n".join([entry['text'] for entry in transcript_with_timecodes])
    
    messages = [
        {"role": "system", "content": (
            "You are an advanced language model and assistant capable of analyzing, summarizing, and extracting key information from text. "
            "Your task is to provide concise, accurate, and insightful summaries of complex content, while also identifying and highlighting "
            "the most important points and insights. You should ensure that the summary is clear and easy to understand, even for someone who "
            "may not be familiar with the original content. Additionally, you should format the summary in a way that is engaging and informative, "
            "using bullet points or numbered lists where appropriate to organize the information. Please also ensure that any technical jargon "
            "is explained or simplified to make the content accessible to a broad audience."
        )},
        {"role": "user", "content": f"Please summarize the following text:\n\n{transcript_text}"}
    ]
    for message in memory.chat_memory.messages:
        if isinstance(message, HumanMessage):
            messages.append({"role": "user", "content": message.content})
        elif isinstance(message, AIMessage):
            messages.append({"role": "assistant", "content": message.content})

    functions = [
        {
            "name": "generate_summary",
            "description": "Generates a summary of the given text",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {
                        "type": "string",
                        "description": "A concise summary of the given text"
                    },
                    "highlights": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "Key highlights from the text"
                    },
                    "insights": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "Key insights from the text"
                    }
                },
                "required": ["summary", "highlights", "insights"],
                "additionalProperties": False
            }
        }
    ]

    # Request a completion from the model with function calling
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        functions=functions,
        function_call={"name": "generate_summary"}  # Force the model to call this function
    )
    
    # Extract and parse the function call result
    function_call = response.choices[0].message.function_call
    if function_call:
        arguments = function_call.arguments
        if arguments:
            result = json.loads(arguments)  # Parse the JSON string into a dictionary
            
            summary = result.get('summary', 'No summary available.')
            highlights = result.get('highlights', [])
            insights = result.get('insights', [])

    memory.chat_memory.add_user_message(transcript_text)
    memory.chat_memory.add_ai_message(summary)

    video_details = get_video_details(youtube_url)

    url_embed = f"https://www.youtube.com/embed/{youtube_url.split('v=')[1].split('&')[0]}"

    video_summary = {
        "videoName": video_details["videoName"],
        "authorName": video_details["authorName"],
        "duration": video_details["duration"],
        "urlEmbed": url_embed,
        "readTime": "1 min 4 secs",  # You might calculate this dynamically based on transcript length
        "summary": summary,
        "transcript": transcript_with_timecodes,
        "highlights": highlights,
        "insights": insights
    }

    return video_summary
