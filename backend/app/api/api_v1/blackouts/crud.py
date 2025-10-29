import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy import select, and_, or_, func
from rapidfuzz import fuzz, process

from utils.regexp import normalize_coordinates, normalize_address
from utils.filters import address_fuzzy_search
from core.models import Blackout, Building, Street
from .schemas import *

async def get_all_blackouts(
    session: AsyncSession,
    date: str = "2018-11-29 00:00:00"
):
    '''
    полуение всех отключений и адресов, 
    которые они затронули и нормализация через
    pydantic схему 
    '''
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

    return json_data


async def get_building_with_blackouts_by_id(
    session: AsyncSession, 
    building_id: str,
    date: str = "2018-11-29 00:00:00"
):
    '''
    получение здания и всех отключений в нём по id.
    если отключений нет, возвращается только адрес 
    '''
    target_date, target_time = date.split()

    # ищем отключения
    stmt = (
        select(Blackout)
        .join(Blackout.buildings)
        .where(
            Building.id == building_id,
            or_(
                Blackout.start_date.like(f"{target_date}%"),
                and_(
                    Blackout.start_date <= date,
                    or_(
                        Blackout.end_date.is_(None),
                        Blackout.end_date >= date
                    )
                )
            )
        )
    )

    result = await session.execute(stmt)
    blackouts = result.scalars().unique().all()

    blackouts_list: List[BlackoutSchema] = []

    for b in blackouts:
        blackouts_list.append(
            BlackoutSchema(
                id=str(b.id),
                start=b.start_date,
                end=b.end_date,
                description=b.description,
                type=b.type,
                initiator_name=getattr(b, "initiator_name", None),
            )
        )

    # если нет отключений, получаем только адрес
    address_stmt = (
        select(Street.name, Building.number)
        .join(Street, Street.id == Building.street_id, isouter=True)
        .where(Building.id == building_id)
    )
    address_result = await session.execute(address_stmt)
    street_name, building_number = address_result.one_or_none() or (None, None)

    address = None
    if street_name:
        address = f"{street_name} {building_number}"

    result_schema = BlackoutsForBuildingSchema(
        blackouts=blackouts_list,
        address=address
    )

    return result_schema.model_dump()



async def search_addresses(
    session: AsyncSession, 
    query: str, limit: 
        int = 100
):
    '''
    "гибкий" поиск по адресам. Возвращает максимально
    похожие на текстовый запрос пользователя адреса
    '''
    query = query.strip().lower()
    if not query:
        return []

    # приводим адрес к нормальному виду
    street_part, number_part = normalize_address(query)

    # запросим все улицы + здания (или ограничим первые N улиц)
    stmt = (
        select(Street.name, Building.number, Building.id)
        .join(Building, Building.street_id == Street.id)
    )
    result = await session.execute(stmt)
    rows = result.all()

    # гибкий поиск в адресах
    filtered_rows = address_fuzzy_search(rows=rows, street_part=street_part, number_part=number_part)

    # сортируем по числу в номере
    def extract_sort_key(num: str):
        m = re.search(r"\d+", num or "")
        return int(m.group()) if m else 0

    filtered_rows.sort(key=lambda r: (extract_sort_key(r.number), r.number))

    ans = [
        AddressSuggestionSchema(
            full_address=f"{r.name}, {r.number}",
            building_id=r.id
        )
        for r in filtered_rows[:limit]
    ]
    return ans