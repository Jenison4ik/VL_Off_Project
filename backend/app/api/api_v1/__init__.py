from fastapi import APIRouter


from core.config import settings
from .blackouts.views import router as blackouts_router

router = APIRouter(
    prefix=settings.api.v1.prefix
)


router.include_router(
    blackouts_router
)