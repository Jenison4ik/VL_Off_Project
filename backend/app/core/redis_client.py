from redis.asyncio import Redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from .config import settings

# чтобы можно было получить
redis_client: Redis | None = None


async def init_redis():
    """
    Инициализация Redis и FastAPICache
    Вызывается один раз в main.py при запуске
    """
    global redis_client
    redis_client = Redis(
        host=settings.redis.host,
        port=settings.redis.port,
        db=settings.redis.db.cache,
    )
    FastAPICache.init(RedisBackend(redis_client), prefix=settings.cache.prefix)
    return redis_client


def get_redis() -> Redis:
    """
    получить экземпляр redis
    """
    if redis_client is None:
        raise RuntimeError("redis не инициализирован")
    return redis_client
