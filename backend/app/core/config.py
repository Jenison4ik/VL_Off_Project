from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel, PostgresDsn


class ApiV1Prefix(BaseModel):
    prefix: str = '/v1'


class ApiPrefix(BaseModel):
    prefix: str = '/api'
    v1: ApiV1Prefix = ApiV1Prefix() 


class DatabaseConfig(BaseModel):
    # url: PostgresDsn
    async_url: str
    sync_url: str
    echo: bool = False


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=('.env.template', '.env'),
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix='APP_CONFIG__',
    )
    api: ApiPrefix = ApiPrefix()
    db: DatabaseConfig
    

settings = Settings()