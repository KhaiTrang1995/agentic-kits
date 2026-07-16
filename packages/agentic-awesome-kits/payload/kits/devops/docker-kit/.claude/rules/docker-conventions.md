# Docker Conventions

> Every skill that generates a Dockerfile / docker-compose MUST follow this rule.

## 1. Dockerfile

### Multi-stage build is mandatory
```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app .
USER nonroot
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:8080/health || exit 1
ENTRYPOINT ["dotnet", "MyApp.dll"]
```

### Rules
| Rule | Correct | Wrong |
|------|------|-----|
| Pin base image tag | `node:20-alpine` | `node:latest` |
| Non-root user | `USER nonroot` / `USER 1001` | Running as root |
| COPY before RUN | COPY csproj → restore → COPY source | COPY all → restore |
| HEALTHCHECK | Present | Missing |
| .dockerignore | Present (bin, obj, node_modules, .git) | Missing |
| Minimize layers | Combine RUN when reasonable | 1 RUN per command |
| No secrets in image | Runtime env var | COPY .env into the image |

### Recommended base images
| Stack | Build | Runtime |
|-------|-------|---------|
| .NET 10 | `sdk:10.0-alpine` | `aspnet:10.0-alpine` |
| Angular | `node:20-alpine` | `nginx:alpine` |
| Python | `python:3.12-slim` | `python:3.12-slim` |
| Go | `golang:1.22-alpine` | `gcr.io/distroless/static` |

## 2. Docker Compose

### Rules
- Compose version 3.8+
- Every service MUST have a `healthcheck`
- `depends_on` with `condition: service_healthy`
- Segmented networks: `frontend`, `backend`, `monitoring`
- Named volumes for persistent data
- Env vars via a `.env` file, NEVER hardcoded in compose
- `restart: unless-stopped` for production
- Expose the minimum ports necessary

### `.env` pattern
```
# .env.example (commit this)
DB_HOST=localhost
DB_PORT=1433
DB_NAME=myapp
DB_PASSWORD=             # do NOT commit real values

# .env (gitignored)
DB_HOST=sql-server
DB_PORT=1433
DB_NAME=myapp_prod
DB_PASSWORD=actual_secret
```

## 3. Security Checklist

- [ ] Non-root user
- [ ] No secret in Dockerfile/image
- [ ] Base image scan (Trivy/Grype)
- [ ] Read-only filesystem where possible
- [ ] No privileged mode
- [ ] Resource limits (CPU, memory)
- [ ] Network segmentation
