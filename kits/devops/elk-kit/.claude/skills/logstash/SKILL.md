---
name: logstash
description: Sketch Logstash / ingest pipelines — input, filter (grok/json/mutate), ES output. No prod deploy.
user-invocable: true
argument-hint: "<service> [--format json|plaintext] [@sample.log]"
---

# /logstash

## Examples

```
/logstash booking-api --format json
/logstash nginx-access @access-sample.log
```

## Process

1. Prefer a real sample line for grok  
2. Input / filter / ECS-ish fields / ES output  
3. Failure tags / DLQ note  
4. L1 → `docs/ops/elk/pipelines/{name}.conf`

## Output

`@_templates/logstash-pipeline.conf`
