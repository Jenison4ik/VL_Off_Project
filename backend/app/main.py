from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from api import api_v1_router as api_router
from core.models.db_helper import db_helper
from core.redis_client import init_redis

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_redis()
    yield
    #shutdown
    await db_helper.dispose()
    

app = FastAPI(
    default_response_class=ORJSONResponse,
    lifespan=lifespan
)

app.include_router(api_router)