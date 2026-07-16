---
name: helm
description: Generate a Helm chart — values.yaml, templates, multi-environment.
user-invocable: true
argument-hint: "<chart-name> [--from-manifests <path>]"
---

# /helm — Generate a Helm Chart

## Input examples
```
/helm container-api
/helm --from-manifests k8s/container-api/    (convert existing manifests to Helm)
```

## Output
```
charts/{chart-name}/
  Chart.yaml
  values.yaml
  values-staging.yaml
  values-prod.yaml
  templates/
    deployment.yaml
    service.yaml
    configmap.yaml
    hpa.yaml
    ingress.yaml
    _helpers.tpl
```

## Mandatory rules
- `values.yaml` is the single source of truth — templates NEVER hardcode values
- Multi-environment via `values-{env}.yaml` overrides
- `_helpers.tpl` for labels and naming conventions
- `NOTES.txt` with post-install instructions
- `.helmignore` excludes test files

## References
- @.claude/rules/k8s-conventions.md
