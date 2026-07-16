# Contributing to agentic-awesome-kits

Thanks for helping improve these kits. This repo packages **AI skill kits** (Skills + Rules + Templates, and optional Brain files) so coding agents produce consistent, production-minded output—not one-off prompts.

## Before you start

1. Open an [issue](https://github.com/KhaiTrang1995/agentic-awesome-kits/issues) for large changes (new kit, breaking skill rename, site redesign). Small fixes can go straight to a PR.
2. Skim the root [README](./README.md) and the kit you are changing.
3. Keep contributions in the **public** tree (`kits/devops/`, `kits/software/`, site files, `packages/`). Do not add private or org-only content.

## What belongs in a kit

Every kit should follow this shape:

```text
{kit-name}/
  README.md
  .claude/
    skills/{skill-name}/SKILL.md
    rules/{conventions}.md
    rules/approval-gate.md
  _templates/          # optional but preferred
  references/          # optional cheatsheets
  *-BRAIN.md           # optional long-lived guidance (obs kits)
```

| Piece | Role |
|-------|------|
| **Skill** | Slash command: when to use, inputs, process, output path, references |
| **Rules** | Single source of truth (security, naming, evidence-only). Skills link here instead of repeating rules |
| **Templates** | Copy-and-fill baselines for AI and humans |
| **Brain** | Philosophy, anti-patterns, skill map (optional) |
| **Approval gate** | L1 plan / L2 diff / L3 iterate; agent never runs risky prod commands |

### Design principles (do not break these)

1. **The agent never runs the risky command** — generate files, checklists, and sample queries only. No `docker build`, `kubectl apply`, mass Zabbix updates, or ES deletes executed by the agent.
2. **Rules over copy-paste** — put shared policy in `rules/*.md`.
3. **Evidence-only on investigations** — no invented metrics, hit counts, or problem IDs; use `TBD` when data is missing.
4. **Secrets stay out** — no real passwords, tokens, connection strings, or SNMP communities in samples.
5. **Kits compose** — reference sibling kits instead of duplicating large convention files when possible.
6. **Examples default to .NET 10** where a runtime sample is needed (e.g. Dockerfile). Skills should still accept other stacks via the prompt.

## Ways to contribute

| Type | Examples |
|------|----------|
| Fix | Typos, broken links, unclear skill steps, template bugs |
| Improve a kit | Stronger rules, better templates, reference cheatsheets |
| New skill in an existing kit | e.g. another check flow under `elk-kit` |
| New kit | New folder under `kits/{category}/` (e.g. `kits/devops/`, `kits/software/`) with full structure + README |
| Docs / site | `index.html`, `kits/devops/index.html`, README, Jekyll config |

### New skill checklist

- [ ] `SKILL.md` has YAML front matter (`name`, `description`, `user-invocable`, `argument-hint`)
- [ ] Clear **when to use**, **examples**, **process**, **output path**
- [ ] References `@.claude/rules/...` (and templates if any)
- [ ] Mutative steps labeled for humans; read-only default for checks
- [ ] Kit `README.md` lists the new skill
- [ ] If the skill is a hub, route table points to sibling skills / kits

### New kit checklist

- [ ] Same structure as existing kits (`docker-kit` / `elk-kit` are good references)
- [ ] `approval-gate.md` + domain `*-conventions.md`
- [ ] At least one usable skill and a kit README with install + examples
- [ ] Linked from root `README.md` and `kits/devops/README.md` or `kits/software/README.md`
- [ ] Linked from docs UI (`index.html` / `kits/devops/index.html`) if it is a public devops kit
- [ ] No dependency on private `share-untrack/` content

## Repo layout (public)

| Path | Purpose |
|------|---------|
| `kits/` | Parent for all public kits by category |
| `kits/devops/` | Container, orchestration, observability kits + docs UI |
| `kits/software/` | Craft/role kits (e.g. `drawio-kit`) |
| `packages/agentic-awesome-kits/` | `npx agentic-awesome-kits` CLI (plan bundle) |
| `index.html`, `kits/devops/index.html` | GitHub Pages docs |
| `_config.yml`, `Gemfile`, `.github/workflows/pages.yml` | Jekyll / Pages |
| `share-untrack/` | **Local only** (gitignored)—not for PRs |

## Pull request process

1. Fork and branch from `main`  
   `git checkout -b fix/short-description` or `feat/short-description`
2. Make focused changes (one kit or one concern per PR when possible).
3. Update docs if behavior or kit list changes.
4. Open a PR against `main` with:
   - **What** changed  
   - **Why**  
   - How to try it (skill command examples help)
5. Be ready to adjust after review.

### Commit style (suggested)

```text
feat(elk-kit): add log-check sample for nginx access logs
fix(zabbix-kit): clarify severity mapping
docs: link CONTRIBUTING from README
```

## Local preview (docs site)

Optional, if you touch Jekyll/Pages files:

```bash
bundle install
bundle exec jekyll serve
# http://127.0.0.1:4000/agentic-awesome-kits/
```

Kit skills themselves do not need a build step—copy `.claude/` into a test project and run the skill in a compatible agent.

## Language

- **Public kits and site:** English (matches existing `kits/devops/*` kits).
- Clear, short sentences; avoid org-specific jargon unless documented.

## Code of conduct (short)

- Be respectful and constructive in issues and PRs.
- Assume good intent; prefer concrete examples over vague criticism.
- Do not submit proprietary customer data, prod secrets, or licensed content you cannot share.

## License

By contributing, you agree your contributions are licensed under the same terms as this repository: [CC BY-NC-SA 4.0](./LICENSE).

## Questions

Open an issue with the `question` label (or a clear title), or discuss on the PR.  
Repo: https://github.com/KhaiTrang1995/agentic-awesome-kits
