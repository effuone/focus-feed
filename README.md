# FocusFeed

**FocusFeed** is an innovative, AI-driven platform designed to revolutionize how we consume and learn from content. In a world where attention spans are shrinking, FocusFeed helps users stay engaged and focused by transforming complex information into short, impactful video summaries that are easy to digest. Whether you're learning from books, articles, podcasts, or videos, FocusFeed adapts to your unique learning style, making education as engaging and effortless as scrolling through social media.

## Features

- **Personalized Learning Experience**: Customize your feed based on your interests, preferred content length, and learning goals. FocusFeed learns from your interactions to provide increasingly personalized content over time.
- **Multi-Format Support**: Upload text, audio, or video content, and FocusFeed will create concise, easy-to-understand video summaries for each.
- **TikTok-Style Presentation**: Summaries are presented in a short, engaging video format, similar to TikTok, which keeps users focused and reduces cognitive overload.
- **Diverse Content Sources**: Whether it’s a book, article, podcast, or video, FocusFeed can integrate content from multiple sources and formats, delivering a cohesive learning experience.

## Getting Started

### Prerequisites

- **Node.js** and **npm**: Required for running the Next.js frontend.
- **Python**: Required for running the FastAPI backend.
- **Redis**: Required for running Celery as a task queue.
- **Docker**: (Optional) For containerized deployment.

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/effuone/focus-feed.git
   cd focusfeed
   ```

2. **Backend Setup (FastAPI with Celery)**:

   ```bash
   cd back
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   celery -A app.celery_worker.celery worker --loglevel=info
   ```

   - **Redis Setup** (if not using Docker):
     ```bash
     redis-server
     ```

3. **Frontend Setup (Next.js)**:

   ```bash
   cd ../front
   npm install
   npm run dev
   ```

4. **Access the Application**:
   - Open your browser and go to `http://localhost:3000` to view the FocusFeed interface.

### Usage

- **Upload Content**: Use the upload interface to submit your books, articles, podcasts, or videos for summarization.
- **View Summaries**: Scroll through your personalized feed of video summaries, tailored to your learning preferences.
- **Engage**: Interact with the summaries by liking, saving, or sharing them with others.
