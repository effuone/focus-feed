FROM python:3.11-slim


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


WORKDIR /app


RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    nano \
    && rm -rf /var/lib/apt/lists/*



COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY ./src /app
COPY .env /app/.env


EXPOSE 8000


RUN adduser --disabled-password --gecos '' appuser
USER appuser


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
