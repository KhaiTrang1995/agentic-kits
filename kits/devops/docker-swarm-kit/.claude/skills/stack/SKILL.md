---
name: stack
description: Generate a Docker Swarm stack file — services, deploy policy (replicas, placement, rolling update/rollback), overlay network.
user-invocable: true
argument-hint: "<stack description> [--replicas <n>] [--with-db] [--with-proxy]"
---

# /stack — Generate a Swarm Stack File

## Input examples
```
/stack .NET API + Angular + Postgres --replicas 3
/stack worker service --replicas 2 --with-db
/stack fullstack --with-proxy    (adds a Traefik front, see traefik-proxy-stack.yml)
```

## Process
1. Detect the services and their dependency order.
2. For each service: base image (reuse `docker-kit/docker-conventions.md` for the Dockerfile side), `deploy:` stanza per `swarm-conventions.md`, healthcheck.
3. Sensitive values → reference an `external: true` secret, never an inline env var — see `/secret`.
4. Attach all services to a stack-scoped overlay network.
5. L1 approval → Write.

## Mandatory rules
- **`deploy.replicas` explicit** for every service — never rely on the Swarm default of 1
- **`resources.limits` + `.reservations`** both set
- **`update_config` + `rollback_config`** both set — a rollout with no rollback plan is incomplete
- **Secrets via `docker secret`** — never plain env vars for passwords/keys/tokens
- **Stateful services** (db, anything with local volume) get `placement.constraints`
- **No inline Ingress** — routing by hostname needs a proxy front (`--with-proxy`), Swarm has no Ingress resource

## Output
```
docker-stack.yml
.env.example              (placeholders only — real secrets are never written to a file the agent generates)
```

## References
- @.claude/rules/swarm-conventions.md
- @../../docker-kit/.claude/rules/docker-conventions.md
