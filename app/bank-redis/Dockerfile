ARG REDIS_VERSION

FROM redis:${REDIS_VERSION}

EXPOSE 6379

ENTRYPOINT [ "redis-server", "--requirepass redispassword" ]
