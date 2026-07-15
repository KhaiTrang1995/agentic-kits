---
name: dockerfile
description: Generate an optimized Dockerfile — multi-stage build, security hardening, small image size.
user-invocable: true
argument-hint: "<stack> [--prod] [--dev]"
---

# /dockerfile — Generate a Dockerfile

## Input examples
```
/dockerfile .NET 10 Minimal API --prod
/dockerfile Angular 20 nginx --prod
/dockerfile Python FastAPI
/dockerfile Go service --prod
/dockerfile --dev fullstack .NET + Angular (docker-compose dev)
```

## Process
1. Detect the stack → pick the right base image
2. Multi-stage build: build stage → runtime stage
3. Security hardening
4. L1 approval → Write

## Mandatory rules
- **Multi-stage build** — separate build and runtime
- **Non-root user** — NEVER run the container as root
- **Specific tag** — `mcr.microsoft.com/dotnet/aspnet:10.0-alpine`, NEVER `latest`
- **COPY before RUN** — leverage layer caching (copy csproj/package.json first, restore, then copy source)
- **.dockerignore** — exclude bin/, obj/, node_modules/, .git/
- **HEALTHCHECK** — mandatory for production
- **NEVER hardcode** secrets/connection strings — use env vars
- **Alpine-based** whenever possible (small image size)

## Output
```
Dockerfile
.dockerignore
```

## References
- @.claude/rules/docker-conventions.md
