from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from api import router as api_router
from core.config import settings
from core.models.db_helper import db_helper

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    #shutdown
    await db_helper.dispose()
    

app = FastAPI(
    default_response_class=ORJSONResponse,
    lifespan=lifespan
)

app.include_router(api_router)