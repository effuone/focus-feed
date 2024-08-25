import io
import mimetypes
import os
import subprocess

import PyPDF2
import pytesseract
import speech_recognition as sr
from langchain.schema import AIMessage, HumanMessage
from openai import OpenAI
from PIL import Image
from pydub import AudioSegment
from youtube_transcript_api import YouTubeTranscriptApi

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


def process_youtube_url(youtube_url: str) -> str:
    video_id = youtube_url.split("v=")[1].split("&")[0]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    transcript_text = "\n".join([entry['text'] for entry in transcript])
    return transcript_text


def summarize_with_openai_and_memory(text, memory):
    # Prepare the system message and the initial user message
    messages = [
        {"role": "system", "content": "You are a helpful assistant that provides detailed summaries of text."},
        {"role": "user", "content": f"Please summarize the following text in detail:\n\n{text}"}
    ]
    
    # Include previous conversation history from memory
    for message in memory.chat_memory.messages:
        if isinstance(message, HumanMessage):
            messages.append({"role": "user", "content": message.content})
        elif isinstance(message, AIMessage):
            messages.append({"role": "assistant", "content": message.content})


    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Change to the valid model you want to use
        messages=messages
    )

    # Extract the generated summary from the response
    summary = response.choices[0].message.content.strip()
    # Add the current user message and AI response to memory
    memory.chat_memory.add_user_message(text)
    memory.chat_memory.add_ai_message(summary)

    return summary