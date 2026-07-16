---
name: elk-health
description: ELK health checklist — cluster status, shards, ILM, disk watermarks, ingest lag, pipeline errors. Docs only.
user-invocable: true
argument-hint: "[--cluster name] [@status-paste]"
---

# /elk-health

## Checklist

1. Cluster color + unassigned shards  
2. Disk watermarks  
3. ILM phases / errors  
4. Ingest / Logstash lag  
5. Circuit breakers / rejects if pasted  
6. Snapshot last success (TBD if unknown)

## Output

`@_templates/elk-health-report.md`

MUTATIVE remediations are human-owned.
