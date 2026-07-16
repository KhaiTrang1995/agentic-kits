# agentic-awesome-kits

Install **public AI skill kits** into your project for Claude Code, Cursor, Codex, Gemini CLI, and similar tools.

```bash
npx agentic-awesome-kits --claude
```

Skills + rules + templates are copied into the project. Nothing is run against your infrastructure.

**Requirements:** Node.js 18+

## What you get

| Category | Kits | Examples |
|----------|------|----------|
| **devops** | docker, docker-swarm, k8s, zabbix, elk, grafana | `/dockerfile`, `/deploy`, `/log-check`, `/loki-query` |
| **software** | drawio-kit | `/architecture`, `/flowchart`, `/erd`, `/diagram` |

List everything bundled in this package:

```bash
npx agentic-awesome-kits --list
```

## Install

Run from your **project root** (project-first; no global install required).

```bash
# Claude Code layout: .claude/skills + .claude/rules + _templates
npx agentic-awesome-kits --claude

# One category
npx agentic-awesome-kits --claude --category devops
npx agentic-awesome-kits --claude --category software

# Specific kits
npx agentic-awesome-kits --claude --kit docker-kit --kit elk-kit

# Other tools (skills directory only)
npx agentic-awesome-kits --cursor --category devops
npx agentic-awesome-kits --codex --kit drawio-kit
npx agentic-awesome-kits --path .agents/skills --kit docker-kit

# Preview only
npx agentic-awesome-kits --claude --dry-run
```

### Layout after `--claude`

```text
.claude/skills/                      # slash-command skills
.claude/rules/                       # conventions the agent should follow
_templates/                          # sample Docker/K8s/drawio baselines
.agentic-awesome-kits-manifest.json  # install record for this project
```

Existing skill folders are kept unless you pass `--force`.

## First commands (after install)

```text
/dockerfile .NET 10 Minimal API --prod
/log-check booking-api --env prod --since 1h
/architecture TOPO overview
```

Examples often use **.NET 10** for containers; skills are stack-agnostic—name another runtime in the prompt when needed.

## Security & privacy

| Topic | Behavior |
|-------|----------|
| Network | CLI does **not** call external APIs; install is local file copy only |
| Telemetry | **None** |
| Credentials | **Not collected** or stored by the CLI |
| Install hooks | **No** `postinstall` / `preinstall` scripts |
| Secrets in kits | Templates use placeholders only (`${ENV}`, external Swarm secrets, K8s secret *names*) |
| Production | DevOps skills use **approval gates** — generate files for human review; do not treat output as auto-deployed |

**You remain responsible for:** reviewing generated manifests, redacting logs/PII before pasting into chat, and applying changes to real environments.

When opening issues or PRs, do not include production hostnames, tokens, customer data, or private logs.

## Options (summary)

| Flag | Meaning |
|------|---------|
| `--claude` / `--cursor` / `--codex` / `--gemini` / … | Target tool layout |
| `--path <dir>` | Custom skills root |
| `--kit <id>` | Install one kit (repeatable) |
| `--category devops\|software` | All kits in a category |
| `--all` | Every kit (default if no kit/category) |
| `--dry-run` | Print actions only |
| `--force` | Overwrite existing skill folders |
| `--list` | Show kits in this package |
| `-h`, `--help` | Help |

## License

**[CC BY-NC-SA 4.0](./LICENSE)** — attribution, non-commercial, share-alike.

Third-party notices may appear inside kits (for example `payload/kits/software/drawio-kit/LICENSE-drawio-skill`). Those files keep their own terms.

Source and issues: the GitHub repository linked from this package’s npm page (`repository` field).
