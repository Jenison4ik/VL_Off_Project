from pydantic import BaseModel, Field
from typing import List, Optional


class BuildingSchema(BaseModel):
    coordinates: list[str]
    address: str
    build_id: str

    class Config:
        from_attributes = True 

class BlackoutInfoSchema(BaseModel):
    start: Optional[str] = Field(None, description="Дата начала отключения")
    end: Optional[str] = Field(None, description="Дата окончания отключения")
    description: Optional[str] = Field(None, description="Описание")
    type: Optional[str] = Field(None, description="Тип отключения")


class BlackoutWithBuildingsSchema(BaseModel):
    blackout: BlackoutInfoSchema
    buildings: List[BuildingSchema]

    class Config:
        from_attributes = True