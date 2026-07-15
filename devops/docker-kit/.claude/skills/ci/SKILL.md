---
name: ci
description: Generate a CI/CD pipeline — build, test, security scan, deploy. Supports GitHub Actions, GitLab CI, Bitbucket Pipelines.
user-invocable: true
argument-hint: "<stack> [--platform github|gitlab|bitbucket] [--with-scan] [--with-deploy]"
---

# /ci — Generate a CI/CD Pipeline

## Input examples
```
/ci .NET 10 --platform bitbucket --with-scan
/ci Angular + .NET fullstack --platform github --with-deploy
/ci Python FastAPI --platform gitlab --with-scan --with-deploy
```

## Pipeline stages

### 1. Build
- Restore dependencies
- Compile/build
- Build the Docker image (if containerized)

### 2. Test
- Unit tests + coverage report
- Lint (dotnet format / eslint / ruff)

### 3. Security Scan (if `--with-scan`)
- Dependency audit (dotnet list --vulnerable / npm audit / pip audit)
- Source code security scan
- Container image scan (Trivy)

### 4. Deploy (if `--with-deploy`)
- Push image to registry
- Deploy to staging (automatic)
- Deploy to production (manual approval)

## Output
```
.github/workflows/ci.yml          ← (GitHub Actions)
bitbucket-pipelines.yml            ← (Bitbucket)
.gitlab-ci.yml                     ← (GitLab)
```

## Rules
- Cache dependencies between runs
- Fail fast: a failed test skips deploy
- Secrets via CI/CD variables, NEVER hardcoded
- Production deploy requires manual approval

## References
- @.claude/rules/docker-conventions.md
