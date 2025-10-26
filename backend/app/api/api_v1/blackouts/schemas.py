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
        
        

class BlackoutSchema(BaseModel):
    id: str = Field(..., description="ID отключения")
    start: Optional[str] = Field(None, description="Дата начала отключения")
    end: Optional[str] = Field(None, description="Дата окончания отключения")
    description: Optional[str] = Field(None, description="Описание отключения")
    type: Optional[str] = Field(None, description="Тип отключения")
    initiator_name: Optional[str] = Field(None, description="Инициатор отключения")

    class Config:
        from_attributes = True


class BlackoutsForBuildingSchema(BaseModel):
    blackouts: List[BlackoutSchema] = Field(..., description="Список отключений для здания")
    address: Optional[str] = Field(None, description="Адрес здания")

    class Config:
        from_attributes = True