from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    #shutdown
   

app = FastAPI(
    default_response_class=ORJSONResponse,
    lifespan=lifespan
)

