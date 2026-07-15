---
name: compose
description: Generate docker-compose.yml — multi-service, network, volumes, healthcheck.
user-invocable: true
argument-hint: "<stack description> [--with-db] [--with-redis] [--with-elk]"
---

# /compose — Generate Docker Compose

## Input examples
```
/compose .NET API + Angular + SQL Server
/compose fullstack --with-db --with-redis
/compose monitoring stack --with-elk
```

## Mandatory rules
- Compose file version 3.8+
- Every service has a **healthcheck**
- **depends_on** with condition `service_healthy`
- Segmented networks: `frontend`, `backend`, `monitoring`
- Named volumes for persistent data (db, logs)
- Environment variables via `.env` file, NEVER hardcoded
- **restart: unless-stopped** for production
- Only expose the ports actually needed

## Output
```
docker-compose.yml
docker-compose.dev.yml    (dev override)
.env.example
```

## References
- @.claude/rules/docker-conventions.md
