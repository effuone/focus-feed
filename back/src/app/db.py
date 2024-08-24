from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import settings

async_engine = create_async_engine(settings.database_url.replace('postgresql://', 'postgresql+asyncpg://'), echo=True)
AsyncSessionLocal = sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)


sync_engine = create_engine(settings.sync_database_url, echo=True)
SyncSessionLocal = sessionmaker(bind=sync_engine, autocommit=False, autoflush=False)

Base = declarative_base()


async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session


# Dependency for sync db session
def get_sync_db():
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()
