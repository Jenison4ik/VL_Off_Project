from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel, PostgresDsn
from redis.asyncio import Redis

class ApiV1Prefix(BaseModel):
    prefix: str = '/v1'
    blackouts: str = '/blackouts'

class ApiPrefix(BaseModel):
    v1: ApiV1Prefix = ApiV1Prefix() 



class RedisDB(BaseModel):
    cache: int = 0


class RedisConfi(BaseModel):
    host: str = 'redis'
    port: int = 6379
    db: RedisDB = RedisDB()


class CacheNamespace(BaseModel):
    blackouts_list: str = 'blackouts-list'


class CacheConfig(BaseModel):
    prefix: str = 'fastapi-cache'
    namespace: CacheNamespace = CacheNamespace()


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
    redis: RedisConfi = RedisConfi()
    cache: CacheConfig = CacheConfig()

    

settings = Settings()