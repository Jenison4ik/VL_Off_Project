from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from redis.asyncio import Redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

from api import api_v1_router as api_router
from core.models.db_helper import db_helper
from core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    redis = Redis(
        host=settings.redis.host,
        port=settings.redis.port,
        db=settings.redis.db.cache
    )
    FastAPICache.init(RedisBackend(redis), prefix=settings.cache.prefix)
    yield
    #shutdown
    await db_helper.dispose()
    

app = FastAPI(
    default_response_class=ORJSONResponse,
    lifespan=lifespan
)

app.include_router(api_router)