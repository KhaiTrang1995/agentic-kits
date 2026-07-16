---
name: secret
description: Generate Swarm secret/config management — external secret references, versioned rotation, config mounts.
user-invocable: true
argument-hint: "<secret-name> [--external] [--rotate] [--config]"
---

# /secret — Generate Swarm Secret/Config Management

## Input examples
```
/secret db-password --external
/secret db-password --rotate         (versioned rotation: db-password → db-password_v2)
/secret nginx-conf --config          (non-sensitive → docker config, not docker secret)
```

## Process
1. Decide **secret vs config**: sensitive value (password, token, key) → `docker secret`; non-sensitive file (nginx.conf, feature-flag JSON) → `docker config`. Both mount as files, neither belongs in an env var's literal value.
2. Reference it in the stack file as `external: true` — the agent never writes the actual secret value into a generated file.
3. For `--rotate`: generate a **versioned** secret name (`{name}_v{n}`) plus the service-level change needed to point at it, and note that the old version stays available until every service referencing it has been updated (Swarm secrets are immutable and can't be edited in place).
4. L1 approval → Write/Edit (the stack file reference only — never the secret's contents).

## Mandatory rules
- **Never** write a real secret value into any file the agent generates — only `docker secret create` commands (for the user to run) or `external: true` references.
- Rotation is always additive (new versioned name), never an in-place overwrite.
- App code must read `/run/secrets/<name>` (the file), not an env var containing the raw value — flag it if the target codebase currently expects an env var.

## Output
```
Reference block added to docker-stack.yml (secrets:/configs: sections, external: true)
docker-secret-create.sh   (reference command showing how to create it out-of-band, not executed by the agent)
```

## References
- @.claude/rules/swarm-conventions.md
