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
    

# @router.get('', response_model=list[UserRead])
# async def get_users(
#     # session: AsyncSession = Depends(db_helper.session_getter),
#     session: Annotated[AsyncSession, Depends(db_helper.async_session_getter)]
    
# ) -> list[User]:
#     users = await users_crud.get_all_users(session=session) 
#     return users


# @router.post('', response_model=UserRead)
# async def create_user(
#     session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
#     user_create: UserCreate,
# ) -> User:
#     user = await  users_crud.create_user(session=session, user_create=user_create)
#     return user
    