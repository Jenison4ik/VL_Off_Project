from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from .crud import get_all_blackouts, get_building_with_blackouts_by_id
from core.models import Blackout
from core.config import settings
from .schemas import BlackoutWithBuildingsSchema, BlackoutsForBuildingSchema

router = APIRouter(
    prefix=settings.api.v1.blackouts,
    tags=["Blackouts"]
)


@router.get('')
async def get_blackouts(
    session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)]
) -> list[BlackoutWithBuildingsSchema]:
    blackouts = await get_all_blackouts(session=session)
    return blackouts
    

@router.get('/{building_id}')
async def get_building_blackouts_by_id(
    session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)],
    building_id: str
) -> BlackoutsForBuildingSchema:
    building = await get_building_with_blackouts_by_id(session=session, building_id=building_id)
    return building
        