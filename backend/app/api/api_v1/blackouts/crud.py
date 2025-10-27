from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy import select, and_, or_

from utils.regexp import normalize_coordinates
from core.models import Blackout, Building
from .schemas import *

async def get_all_blackouts(
    session: AsyncSession,
    date: str = "2018-11-29 00:00:00"
):
    target_date, target_time = date.split()
    subquery = (
        select(Blackout.id)
        .join(Blackout.buildings)
        .where(
            Building.coordinates.isnot(None),
            Building.is_fake != 1,
            or_(
                # началось в этот день
                Blackout.start_date.like(f"{target_date}%"),
                # началось раньше и еще не закончилось
                and_(
                    Blackout.start_date <= date,
                    or_(
                        Blackout.end_date.is_(None),
                        Blackout.end_date >= date
                    )
                )
            )
        )
        .subquery()
    )

    stmt = select(Blackout).where(Blackout.id.in_(select(subquery.c.id)))

    result = await session.execute(stmt)
    blackouts = result.scalars().unique().all()
    
    data: list[BlackoutWithBuildingsSchema] = []
    
    for b in blackouts:
        blackout_info = BlackoutInfoSchema(
            start=b.start_date,
            end=b.end_date,
            description=b.description,
            type=b.type,
        )

        buildings_data = []
        for build in b.buildings:
            coords = normalize_coordinates(build.coordinates)
            street = build.street.name if build.street else None
            if coords and street:
                address = f"{street} {build.number}"
                buildings_data.append(BuildingSchema(
                    coordinates=coords,
                    address=address,
                    build_id=build.id
                ))

        blackout_data = BlackoutWithBuildingsSchema(
            blackout=blackout_info,
            buildings=buildings_data
        )
        data.append(blackout_data)
        
    json_data = [item.model_dump() for item in data]

    print(len(json_data))
    return json_data


async def get_building_with_blackouts_by_id(
    session: AsyncSession, 
    building_id: str,
    date: str = "2018-11-29 00:00:00"
):
    target_date, target_time = date.split()
    stmt = (
        select(Blackout)
        .join(Blackout.buildings)
        .where(
            Building.id == building_id,
            or_(
                # начались именно в этот день
                Blackout.start_date.like(f"{target_date}%"),
                # начались раньше и еще не закончились
                and_(
                    Blackout.start_date <= date,
                    or_(
                        Blackout.end_date.is_(None),
                        Blackout.end_date >= date
                    )
                )
            )
        )
        .options(
            # подгружаем здания и улицы, чтобы собрать адрес
            selectinload(Blackout.buildings).joinedload(Building.street)
        )
    )

    result = await session.execute(stmt)
    blackouts = result.scalars().unique().all()

    blackouts_list: List[BlackoutSchema] = []
    address: Optional[str] = None

    for b in blackouts:
        bo = BlackoutSchema(
            id=str(b.id),
            start=b.start_date,
            end=b.end_date,
            description=b.description,
            type=b.type,
            initiator_name=getattr(b, "initiator_name", None),
        )
        blackouts_list.append(bo)


        if address is None: 
            for build in b.buildings:
                if str(build.id) != building_id:
                    continue

                coords = normalize_coordinates(build.coordinates)
                street = build.street.name if build.street else None
                if coords and street:
                    address = f"{street} {build.number}"
                    break

    result_schema = BlackoutsForBuildingSchema(
        blackouts=blackouts_list,
        address=address
    )
    
    return result_schema.model_dump()