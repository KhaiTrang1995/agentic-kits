# Approval Gate — K8s Kit

> The AI MUST ask permission before creating/editing a file. No skill ever runs `kubectl apply` or `helm install` on its own.

## 3 Levels

| Level | When | User responds |
|-------|------|----------------|
| **L1 Plan** | Before any Write/Edit | Y = proceed, n = cancel, edit = revise the plan |
| **L2 Diff** | When editing an existing file | Y = apply, n = keep as-is |
| **L3 Iterate** | Output that needs review (alert rule threshold, HPA policy) | Approve / Revise: ... / Cancel |

## L1 — Plan Preview

Before creating a file, the skill prints:

```
[/deploy] Will create:
  1. k8s/container-api/deployment.yaml   — 3 replicas, resource limits, probes
  2. k8s/container-api/service.yaml      — ClusterIP
  3. k8s/container-api/hpa.yaml          — autoscale 2-10, target CPU 70%
  4. k8s/container-api/kustomization.yaml

Apply? (Y/n):
```

## Rules

- L1 is mandatory even for a single file.
- The AI **NEVER runs** `kubectl apply` or `helm install/upgrade` against a real cluster — it only generates manifests; DevOps applies them after review.
- Never skip approval because "the file is small" or "the user already confirmed in another skill."
- L2 runs AFTER L1 (L1 lists files, L2 shows a diff per file once the user says Y).
- L3 runs BEFORE L1 (render preview → user approves → L1 plan write).
- Any manifest touching `namespace: production` or a Secret must always restate the risk before the user confirms Y.
