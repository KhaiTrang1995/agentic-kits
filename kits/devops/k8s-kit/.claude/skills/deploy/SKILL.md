---
name: deploy
description: Generate K8s manifests — Deployment, Service, ConfigMap, HPA, Ingress.
user-invocable: true
argument-hint: "<app-name> [--namespace <ns>] [--replicas <n>] [--with-ingress]"
---

# /deploy — Generate Kubernetes Manifests

## Input examples
```
/deploy container-api --namespace prod --replicas 3 --with-ingress
/deploy angular-app --namespace staging
/deploy worker-service --replicas 2
```

## Output
```
k8s/{app-name}/
  deployment.yaml
  service.yaml
  configmap.yaml
  hpa.yaml             (auto-scale)
  ingress.yaml          (if --with-ingress)
  kustomization.yaml
```

## Mandatory rules
- **Resource limits** (cpu/memory) are mandatory — never deploy without setting limits
- **Liveness + Readiness probes** for every container
- **ConfigMap/Secret** for config — NEVER hardcode env vars in the deployment
- **Standard labels**: `app`, `version`, `team`, `environment`
- **Explicit namespace**, NEVER use `default`
- **Rolling update** strategy (maxSurge: 1, maxUnavailable: 0)
- **Security context**: runAsNonRoot, readOnlyRootFilesystem

## References
- @.claude/rules/k8s-conventions.md
