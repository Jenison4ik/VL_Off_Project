from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine, async_sessionmaker

from sqlalchemy import create_engine, MetaData, Table, select

from core.config import settings


class DatabaseHelper:
    def __init__(self, 
                 async_url: str, 
                 sync_url: str,
                 echo: bool = False,
                ):
        
        # async
        self.async_engine: AsyncEngine = create_async_engine(
            url=async_url,
            echo=echo,
        )
        
        self.async_session_factory: async_sessionmaker[AsyncSession] = async_sessionmaker(
            bind=self.async_engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False
        )
        
        # sync
        self.sync_engine = create_engine(sync_url)
        
        
    async def dispose(self):
        await self.async_engine.dispose()
        
    
    async def async_session_getter(self) -> AsyncGenerator[AsyncSession, None]:
        async with self.async_session_factory() as session:
            yield session



db_helper = DatabaseHelper(
    async_url=str(settings.db.async_url),
    sync_url=str(settings.db.sync_url),
    echo=settings.db.echo,
)