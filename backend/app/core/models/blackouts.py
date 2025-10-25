from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr
from sqlalchemy.orm import sessionmaker, registry, relationship
from sqlalchemy import MetaData

from core.config import settings
from core.models.db_helper import db_helper

metadata = MetaData()
metadata.reflect(bind=db_helper.sync_engine)


# Создаём registry 
mapper_registry = registry()

# Достаём таблицы 
blackouts_table = metadata.tables["blackouts"]
buildings_table = metadata.tables["buildings"]
blackouts_buildings_table = metadata.tables["blackouts_buildings"]


@mapper_registry.mapped
class Blackout:
    __table__ = blackouts_table

    buildings = relationship(
        "Building",
        secondary=blackouts_buildings_table,
        back_populates="blackouts",
        lazy="selectin" 
    )


@mapper_registry.mapped
class Building:
    __table__ = buildings_table

    blackouts = relationship(
        "Blackout",
        secondary=blackouts_buildings_table,
        back_populates="buildings"
    )
