# Kubernetes Conventions

> Every skill that generates a K8s manifest / Helm chart MUST follow this rule.

## 1. Mandatory labels

Every resource MUST carry these labels:
```yaml
metadata:
  labels:
    app.kubernetes.io/name: container-api
    app.kubernetes.io/version: "1.2.0"
    app.kubernetes.io/component: backend        # backend | frontend | database | worker
    app.kubernetes.io/part-of: my-system
    app.kubernetes.io/managed-by: helm          # helm | kubectl | argocd
    team: platform
    environment: production                     # production | staging | dev
```

## 2. Resource Limits — Mandatory

Never deploy without setting limits. Template:
```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

Sizing guideline:
| App type | CPU request | Memory request | CPU limit | Memory limit |
|----------|------------|----------------|-----------|--------------|
| .NET API | 100m | 256Mi | 1000m | 1Gi |
| Angular (nginx) | 50m | 64Mi | 200m | 128Mi |
| Worker/batch | 200m | 512Mi | 2000m | 2Gi |
| Database | 500m | 1Gi | 2000m | 4Gi |

## 3. Probes — Mandatory

Every container MUST have all 3 probes:
```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
startupProbe:
  httpGet:
    path: /health/live
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
```

## 4. Security Context

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop: ["ALL"]
```

## 5. Deployment Strategy

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

- Zero-downtime: `maxUnavailable: 0`.
- `minReadySeconds: 10` — wait for the pod to be ready before terminating the old one.
- PodDisruptionBudget: `minAvailable: 1` for stateful workloads.

## 6. ConfigMap / Secret

- Config via ConfigMap, secrets via Secret — NEVER hardcode env vars in the Deployment.
- Secret: `type: Opaque`, base64-encoded.
- External Secrets Operator for production (if a vault is available).
- NEVER commit a Secret manifest to Git — use sealed-secrets or SOPS.

## 7. Networking

- Service type: `ClusterIP` (default), `NodePort` (dev), `LoadBalancer` (only when needed).
- Ingress for HTTP routing — `nginx-ingress` or `traefik`.
- NetworkPolicy: restrict traffic between namespaces.
- Separate namespaces: `prod`, `staging`, `dev`.

## 8. HPA (Auto-scaling)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```
