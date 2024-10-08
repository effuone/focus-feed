from pathlib import Path

import redis.asyncio as aioredis
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import AsyncSession

from .app.config import settings
from .app.db import Base, async_engine, get_async_db
from .auth.auth import router as auth_router
from .multiformatsupport.api import router as multiformat_router
from .pdf.api import router as pdf_router
from .quiz.api import router as quiz_router

load_dotenv(Path(__file__).parent.parent / '.env')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = aioredis.from_url(settings.redis_url)


@app.on_event("startup")
async def startup():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def check_health(db: AsyncSession = Depends(get_async_db)):
    try:
        await db.execute(text("SELECT 1"))
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        await redis_client.ping()
    except (aioredis.ConnectionError, aioredis.TimeoutError):
        raise HTTPException(status_code=500, detail="Redis connection failed")

    return {"status": "ok", "database": "connected", "redis": "connected"}
  
app.include_router(pdf_router, prefix="/pdf", tags=["pdf"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])

app.include_router(multiformat_router, prefix="/multiformat")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(quiz_router, prefix="/quiz", tags=["quiz"])