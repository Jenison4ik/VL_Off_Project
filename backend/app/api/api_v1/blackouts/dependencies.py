from typing import Annotated
from fastapi import  Depends
from sqlalchemy.ext.asyncio import AsyncSession


from core.models.db_helper import db_helper
from .crud import get_all_blackouts

async def get_blackouts_list(
    session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)],
):
    return await get_all_blackouts(session=session)