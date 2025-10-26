from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


from utils.regexp import normalize_coordinates
from core.models import Blackout, Building
from .schemas import BlackoutWithBuildingsSchema, BlackoutInfoSchema, BuildingSchema

async def get_all_blackouts(
    session: AsyncSession,
):

    subquery = (
        select(Blackout.id)
        .join(Blackout.buildings)
        .where(
            Building.coordinates.isnot(None),
            Building.is_fake != 1,
            Blackout.start_date.like("2018-11-29%")
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
