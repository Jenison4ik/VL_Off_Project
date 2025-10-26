from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


from utils.regexp import normalize_coordinates
from core.models import Blackout, Building


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
    blackouts = result.scalars().all()
    
    data = []
    
    for b in blackouts:
        blackout = {}
        blackout["buildings"] = []
        blackout["blackout"] = {
            "start": b.start_date,
            "end": b.end_date,
            "description": b.description,
            "type": b.type,
        }
        for build in b.buildings:
            coords = normalize_coordinates(build.coordinates)
            if coords:
                blackout["buildings"].append({
                    "coordinates": coords
                })
        data.append(blackout)
    print(len(data))
    return data

