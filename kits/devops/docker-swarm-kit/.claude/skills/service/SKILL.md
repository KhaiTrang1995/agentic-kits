---
name: service
description: Generate or update a single Swarm service definition — scaling, resource limits, rolling update policy, health check.
user-invocable: true
argument-hint: "<service-name> [--scale <n>] [--update-parallelism <n>] [--constraint <expr>]"
---

# /service — Generate/Update a Swarm Service

## Input examples
```
/service api --scale 5 --update-parallelism 2
/service db --constraint "node.labels.tier==data"
/service worker --scale 3
```

## Process
1. If the service already exists in a stack file → propose an **Edit** (L2 diff) to its `deploy:` block, not a new file.
2. If it's a new standalone service outside a stack → generate the equivalent `docker service create` command **as a reference**, clearly labeled as something the user runs themselves (the agent never runs it).
3. Apply the same `deploy:` rules as `/stack` (resources, update_config, rollback_config, restart_policy).
4. L1/L2 approval → Write/Edit.

## Mandatory rules
- Scaling changes always state the before/after replica count and whether it's zero-downtime.
- `--update-parallelism` above 1 requires the service to already have a `HEALTHCHECK` (see `swarm-conventions.md` Section 2) — warn if it doesn't.
- Placement constraint changes on a stateful service must flag the risk of the scheduler moving it away from its data volume.

## Output
```
Edit to the existing docker-stack.yml service block
   — or, for a one-off service —
docker-service-create.sh   (reference command, commented, not executed by the agent)
```

## References
- @.claude/rules/swarm-conventions.md
