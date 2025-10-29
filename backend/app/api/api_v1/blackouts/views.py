from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_cache.decorator import cache

from core.models.db_helper import db_helper
from .crud import get_all_blackouts, get_building_with_blackouts_by_id, search_addresses
from core.models import Blackout
from core.config import settings
from .schemas import AddressSuggestionSchema, BlackoutWithBuildingsSchema, BlackoutsForBuildingSchema
from utils.key_builder import blackouts_key_builder
from .dependencies import get_blackouts_list

router = APIRouter(
    prefix=settings.api.v1.blackouts,
    tags=["Blackouts"]
)

@router.get('', response_model=list[BlackoutWithBuildingsSchema])
@cache(expire=300, key_builder=blackouts_key_builder, namespace=settings.cache.namespace.blackouts_list)
async def get_blackouts(
    blackouts_list: Annotated[list[BlackoutWithBuildingsSchema], Depends(get_blackouts_list)]
):
    return blackouts_list
    

@router.get('/{building_id}', response_model=BlackoutsForBuildingSchema)
@cache(expire=300, key_builder=blackouts_key_builder, namespace=settings.cache.namespace.blackout_building)
async def get_building_blackouts_by_id(
    session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)],
    building_id: str
):
    building = await get_building_with_blackouts_by_id(session=session, building_id=building_id)
    return building
        
        
        
@router.get('/search/building', response_model=list[AddressSuggestionSchema])
async def get_similar_addresses(
    q: str,
    session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)],
):
    addresses = await search_addresses(session=session, query=q)
    return addresses