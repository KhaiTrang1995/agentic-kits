# Maintainer: publish to npm

Internal checklist. **This file is not included in the npm tarball** (`package.json` → `"files"`).

## Before you publish

1. Confirm GitHub repo is public and named `agentic-awesome-kits` (or update `package.json` repository URLs).
2. Account on [npmjs.com](https://www.npmjs.com/) with **2FA** enabled.
3. Prefer a **granular access token** (Publish) over password; never commit `.npmrc` with `_authToken`.
4. Do not put email, phone, real name, employer, or private folder names in package README.

## Security checklist

```text
[ ] Only kits under monorepo kits/devops and kits/software are packed
[ ] npm pack --dry-run includes: package.json, README.md, LICENSE, bin/, payload/
[ ] LICENSE present at package root (CC-BY-NC-SA-4.0; copy from monorepo LICENSE if missing)
[ ] No .env, tokens, private research trees, or local absolute paths in tarball
[ ] package.json has no postinstall/preinstall
[ ] README is user-facing only (no private research paths)
```

## Publish steps

```bash
# Login once per machine
npm login
npm whoami

cd packages/agentic-awesome-kits
npm run pack
npm pack --dry-run
node bin/cli.js --list

# First publish
npm publish

# Verify
npm view agentic-awesome-kits version
npx agentic-awesome-kits@0.1.1 --list
```

`prepublishOnly` / `prepack` re-run pack from monorepo `kits/` automatically.

## Version bumps

npm **never** allows re-publishing the same version (`You cannot publish over the previously published versions`).

```bash
cd packages/agentic-awesome-kits
npm version patch   # 0.1.0 → 0.1.1  (or minor / major)
npm publish
# commit package.json + git tag from monorepo root, then push
```

## Incident response

- Prefer: `npm deprecate agentic-awesome-kits@x.y.z "reason"` + ship a fixed version.
- Unpublish is limited in time and disruptive; avoid unless secrets leaked.

## Local monorepo commands

```bash
node packages/agentic-awesome-kits/scripts/pack-kits.mjs
node packages/agentic-awesome-kits/bin/cli.js --list
node packages/agentic-awesome-kits/bin/cli.js --claude --dry-run
```
