from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_cache.decorator import cache

from core.models.db_helper import db_helper
from .crud import get_all_blackouts, get_building_with_blackouts_by_id
from core.models import Blackout
from core.config import settings
from .schemas import BlackoutWithBuildingsSchema, BlackoutsForBuildingSchema
from utils.key_builder import blackouts_key_builder
from .dependencies import get_blackouts_list

router = APIRouter(
    prefix=settings.api.v1.blackouts,
    tags=["Blackouts"]
)

@router.get('')
@cache(expire=300, key_builder=blackouts_key_builder)
async def get_blackouts(
    blackouts_list: Annotated[list[BlackoutWithBuildingsSchema], Depends(get_blackouts_list)]
) -> list[BlackoutWithBuildingsSchema]:
    return blackouts_list
    

@router.get('/{building_id}')
@cache(expire=300, key_builder=blackouts_key_builder)
async def get_building_blackouts_by_id(
    session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)],
    building_id: str
) -> BlackoutsForBuildingSchema:
    building = await get_building_with_blackouts_by_id(session=session, building_id=building_id)
    return building
        