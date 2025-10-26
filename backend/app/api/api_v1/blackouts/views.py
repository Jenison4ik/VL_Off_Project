from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from .crud import get_all_blackouts
from core.models import Blackout
from core.config import settings

router = APIRouter(
    prefix=settings.api.v1.blackouts,
    tags=["Blackouts"]
)


@router.get('')
async def get_blackouts(
    session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)]
):
    blackouts = await get_all_blackouts(session=session)
    return blackouts
    

