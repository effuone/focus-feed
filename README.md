FocusFeed

**FocusFeed** is an innovative, AI-driven platform designed to revolutionize how we consume and learn from content. In a world where attention spans are shrinking, FocusFeed helps users stay engaged and focused by transforming complex information into short, impactful video summaries that are easy to digest. Whether you're learning from books, articles, podcasts, or videos, FocusFeed adapts to your unique learning style, making education as engaging and effortless as scrolling through social media.

## Features

- **User-Centric Profiling**: Upon first login, users engage in a quiz that helps us understand their preferences and learning style, enabling a tailored content experience as they explore and consume information.

- **Comprehensive File Upload**: Users can upload multiple files with ease and view detailed previews. Each file is summarized according to the user’s profile, featuring keyword highlights, overviews, conclusions, key points, arguments, and insights.

- **YouTube Summarization**: Simply provide a YouTube URL and receive concise summaries that include key points, full transcripts, and actionable insights to enhance your understanding.

- **Chapter-Based Book Summaries**: Dive into book summaries chapter by chapter, with the option to watch brief videos for each section. This feature makes it easy to grasp the essence of any book, one chapter at a time.

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
   docker-compose up --build
   ```

3. **Frontend Setup (Next.js)**:

   ```bash
   cd ../front
   npm install
   npm run dev
   ```

4. **Access the Application**:
   - Open your browser and go to `http://localhost:3000` to view the FocusFeed interface.
   - Open your browser and go to `http://localhost:8000/docs` to view the FastAPI Swagger documentation.

### Usage

- **Upload Content**: Use the upload interface to submit your books, articles, podcasts, or videos for summarization.
- **View Summaries**: Scroll through your personalized feed of video summaries, tailored to your learning preferences.
- **Engage**: Interact with the summaries by liking, saving, or sharing them with others.
