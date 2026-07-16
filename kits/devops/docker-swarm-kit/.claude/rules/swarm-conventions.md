# Docker Swarm Conventions

> Every skill that generates a stack file / service definition MUST follow this rule. Builds on `docker-kit/docker-conventions.md` for the image/Dockerfile side — this file only covers what's specific to Swarm's `deploy:` model.

## 1. Deploy stanza — mandatory fields

Every service in a stack file MUST set `deploy:` explicitly — never rely on Swarm defaults.

```yaml
services:
  api:
    image: registry.example.com/api:1.4.0
    deploy:
      replicas: 3
      placement:
        constraints:
          - node.role == worker
        preferences:
          - spread: node.labels.zone
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
        failure_action: rollback
        monitor: 30s
      rollback_config:
        parallelism: 1
        order: stop-first
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 60s
```

| Field | Rule |
|-------|------|
| `replicas` | Explicit — never omit (Swarm defaults to 1, rarely what you want in production) |
| `resources.limits` **and** `.reservations` | Both mandatory — limits alone let the scheduler over-pack a node |
| `update_config` | Mandatory — `order: start-first` for zero-downtime services with a healthcheck |
| `rollback_config` | Mandatory alongside `update_config` — a rollout without a defined rollback is incomplete output |
| `restart_policy` | Mandatory — `condition: on-failure` for services, `condition: any` only for one-shot/batch jobs |
| `placement.constraints` | Explicit for anything stateful (databases pinned to a labeled node with a volume) |

## 2. Health checks

Swarm uses the image's `HEALTHCHECK` (see `docker-kit/docker-conventions.md`) to decide whether a rolling update step succeeded. A service with `update_config.order: start-first` but **no** `HEALTHCHECK` in its image will report "running" before it's actually ready — always verify the image has one before setting `order: start-first`.

## 3. Secrets & Configs — never plain env vars

Sensitive values are **Swarm secrets**, not environment variables:

```yaml
services:
  api:
    image: registry.example.com/api:1.4.0
    secrets:
      - db_password
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password   # app reads the file, not env var value

secrets:
  db_password:
    external: true   # created out-of-band: docker secret create db_password ./db_password.txt
```

| Rule | Correct | Wrong |
|------|---------|-------|
| Secret source | `external: true`, created via `docker secret create` outside the stack file | Value inlined in the stack file |
| App reads secret | From `/run/secrets/<name>` (file) | From an env var containing the raw value |
| Rotation | New secret with a versioned name (`db_password_v2`) + update service to reference it | Overwriting a secret in place (Swarm secrets are immutable once created) |
| Non-sensitive config | `configs:` (same mount pattern, not encrypted at rest) | Mixed into `secrets:` |

## 4. Networking

- Every stack gets its own **overlay network** — never attach unrelated stacks to the same network by default.
- `attachable: true` only when you deliberately need a standalone container (e.g. a debug shell) to join the network.
- Publish ports in `ingress` mode (default) for load-balanced access across all nodes; use `mode: host` only when you need the source IP preserved or a specific node's port.
- No native Ingress/host-routing resource exists in Swarm — for HTTP(S) routing by hostname/path, front the stack with a reverse proxy (Traefik or nginx) that discovers services via labels. See `_templates/traefik-proxy-stack.yml`.

## 5. Placement & node labels

- Stateful services (databases, anything with a bind-mounted or local volume) MUST have a `placement.constraints` pinning them to a specific labeled node — Swarm does not follow the volume automatically like a k8s StatefulSet + PV would.
- Label nodes with intent, not hostname: `node.labels.tier == data`, not `node.hostname == db-server-01` — keeps the stack file portable if the node is replaced.

## 6. Security Checklist

- [ ] `deploy.resources.limits` and `.reservations` both set
- [ ] `update_config` + `rollback_config` both set
- [ ] Secrets via `docker secret`, never env vars or baked into the image
- [ ] Non-root user in the image (inherited from `docker-kit/docker-conventions.md`)
- [ ] Overlay network scoped to the stack, not shared broadly
- [ ] Stateful services pinned via `placement.constraints`
