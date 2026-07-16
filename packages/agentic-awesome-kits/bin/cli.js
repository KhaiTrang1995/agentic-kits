#!/usr/bin/env node
/**
 * agentic-awesome-kits CLI — install public kits from package payload.
 * Default: project-first (CWD), local file copy only.
 */
"use strict";

const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const PAYLOAD = path.join(ROOT, "payload");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

function loadCatalog() {
  const p = path.join(PAYLOAD, "catalog.json");
  if (!fs.existsSync(p)) {
    throw new Error(
      "Missing payload/catalog.json — rebuild with: npm run pack (from this package directory)",
    );
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function help(catalog) {
  const kitList = (catalog?.kits || [])
    .map((k) => `    ${k.category}/${k.id}  (${k.skills.join(", ")})`)
    .join("\n");
  console.log(`
agentic-awesome-kits v${pkg.version}

  npx agentic-awesome-kits [options]

Install public kits from this package into your **project** (current directory).
Source of kits: monorepo kits/devops + kits/software (packed into payload/).

Options:
  --claude              → ./.claude/skills + ./.claude/rules + ./_templates
  --cursor              → ./.cursor/skills
  --gemini              → ./.gemini/skills
  --codex               → ./.codex/skills
  --antigravity         → ./.agents/skills
  --agy                 → ./.gemini/antigravity-cli/skills
  --kiro                → ./.kiro/skills
  --path <dir>          Custom skills root (project-relative or absolute)

  --kit <id>            Install one kit (repeatable), e.g. --kit docker-kit
  --category <name>     Install all kits in category: devops | software
  --all                 Install every kit (default if no --kit/--category)

  --dry-run             Print actions only
  --force               Overwrite existing skill folders
  -h, --help            Help
  --list                List kits in payload

Examples:
  npx agentic-awesome-kits --claude
  npx agentic-awesome-kits --claude --category devops
  npx agentic-awesome-kits --claude --kit docker-kit --kit elk-kit
  npx agentic-awesome-kits --path .agents/skills --category software --dry-run

Kits in this package:
${kitList || "    (run pack-kits.mjs first)"}
`);
}

function parse(argv) {
  const o = {
    dryRun: false,
    force: false,
    list: false,
    help: false,
    all: false,
    kits: [],
    categories: [],
    flags: [],
    path: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") o.help = true;
    else if (a === "--list") o.list = true;
    else if (a === "--dry-run") o.dryRun = true;
    else if (a === "--force") o.force = true;
    else if (a === "--all") o.all = true;
    else if (a === "--kit") o.kits.push(argv[++i]);
    else if (a === "--category") o.categories.push(argv[++i]);
    else if (a === "--path") o.path = argv[++i];
    else if (a === "--global") {
      console.error("Error: --global not supported; install is project-first (CWD).");
      process.exitCode = 1;
      return null;
    } else if (a.startsWith("--")) o.flags.push(a.slice(2));
    else {
      console.error(`Unknown argument: ${a}`);
      process.exitCode = 1;
      return null;
    }
  }
  return o;
}

function resolveTarget(opts, cwd) {
  if (opts.path) {
    return {
      name: "custom",
      mode: "skills-only",
      skillsDir: path.resolve(cwd, opts.path),
    };
  }
  const f = opts.flags;
  if (f.includes("claude")) {
    return {
      name: "claude",
      mode: "claude-project",
      root: path.join(cwd, ".claude"),
      skillsDir: path.join(cwd, ".claude", "skills"),
      rulesDir: path.join(cwd, ".claude", "rules"),
      templatesDir: path.join(cwd, "_templates"),
    };
  }
  if (f.includes("cursor")) {
    return { name: "cursor", mode: "skills-only", skillsDir: path.join(cwd, ".cursor", "skills") };
  }
  if (f.includes("gemini")) {
    return { name: "gemini", mode: "skills-only", skillsDir: path.join(cwd, ".gemini", "skills") };
  }
  if (f.includes("codex")) {
    return { name: "codex", mode: "skills-only", skillsDir: path.join(cwd, ".codex", "skills") };
  }
  if (f.includes("antigravity")) {
    return {
      name: "antigravity",
      mode: "skills-only",
      skillsDir: path.join(cwd, ".agents", "skills"),
    };
  }
  if (f.includes("agy")) {
    return {
      name: "agy",
      mode: "skills-only",
      skillsDir: path.join(cwd, ".gemini", "antigravity-cli", "skills"),
    };
  }
  if (f.includes("kiro")) {
    return { name: "kiro", mode: "skills-only", skillsDir: path.join(cwd, ".kiro", "skills") };
  }
  return null;
}

function selectKits(catalog, opts) {
  let list = catalog.kits.slice();
  if (opts.kits.length) {
    list = list.filter((k) => opts.kits.includes(k.id));
    const missing = opts.kits.filter((id) => !catalog.kits.some((k) => k.id === id));
    if (missing.length) throw new Error(`Unknown kit(s): ${missing.join(", ")}`);
  }
  if (opts.categories.length) {
    list = list.filter((k) => opts.categories.includes(k.category));
  }
  if (!opts.kits.length && !opts.categories.length) {
    // default all
    list = catalog.kits.slice();
  }
  return list;
}

function copyDirSync(src, dest, force) {
  if (!fs.existsSync(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let n = 0;
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) n += copyDirSync(s, d, force);
    else {
      if (fs.existsSync(d) && !force) {
        // skip file keep existing unless force
        continue;
      }
      fs.copyFileSync(s, d);
      n += 1;
    }
  }
  return n;
}

function installKit(kitMeta, target, force, dryRun) {
  const kitRoot = path.join(PAYLOAD, kitMeta.path);
  if (!fs.existsSync(kitRoot)) {
    throw new Error(`Payload missing kit: ${kitMeta.path}`);
  }
  const actions = [];
  const skillsSrc = path.join(kitRoot, ".claude", "skills");
  const rulesSrc = path.join(kitRoot, ".claude", "rules");
  const templatesSrc = path.join(kitRoot, "_templates");

  if (target.mode === "claude-project") {
    if (fs.existsSync(skillsSrc)) {
      for (const sk of fs.readdirSync(skillsSrc, { withFileTypes: true })) {
        if (!sk.isDirectory()) continue;
        const dest = path.join(target.skillsDir, sk.name);
        actions.push({ op: "skill", from: path.join(skillsSrc, sk.name), to: dest });
      }
    }
    if (fs.existsSync(rulesSrc) && target.rulesDir) {
      actions.push({ op: "rules", from: rulesSrc, to: target.rulesDir });
    }
    if (fs.existsSync(templatesSrc) && target.templatesDir) {
      actions.push({ op: "templates", from: templatesSrc, to: target.templatesDir });
    }
  } else {
    // skills-only targets: copy each skill folder into skillsDir
    if (fs.existsSync(skillsSrc)) {
      for (const sk of fs.readdirSync(skillsSrc, { withFileTypes: true })) {
        if (!sk.isDirectory()) continue;
        const dest = path.join(target.skillsDir, sk.name);
        actions.push({ op: "skill", from: path.join(skillsSrc, sk.name), to: dest });
      }
    }
  }

  let written = 0;
  for (const a of actions) {
    if (dryRun) {
      console.log(`  [dry-run] ${a.op}: ${a.to}`);
      continue;
    }
    if (a.op === "skill") {
      if (fs.existsSync(a.to) && !force) {
        console.log(`  skip existing skill ${path.basename(a.to)} (use --force)`);
        continue;
      }
      if (fs.existsSync(a.to) && force) fs.rmSync(a.to, { recursive: true, force: true });
      written += copyDirSync(a.from, a.to, true);
    } else {
      written += copyDirSync(a.from, a.to, force);
    }
  }
  return { actions: actions.length, written };
}

function writeManifest(cwd, kits, target) {
  const manifest = {
    schemaVersion: 1,
    package: pkg.name,
    version: pkg.version,
    installedAt: new Date().toISOString(),
    target: target.name,
    kits: kits.map((k) => ({ id: k.id, category: k.category, skills: k.skills })),
  };
  const p = path.join(cwd, ".agentic-awesome-kits-manifest.json");
  fs.writeFileSync(p, JSON.stringify(manifest, null, 2) + "\n");
  return p;
}

function main() {
  let catalog;
  try {
    catalog = loadCatalog();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
    return;
  }

  const opts = parse(process.argv.slice(2));
  if (!opts) return;

  if (opts.help || process.argv.length <= 2) {
    help(catalog);
    return;
  }
  if (opts.list) {
    console.log("Kits in payload:\n");
    for (const k of catalog.kits) {
      console.log(`  ${k.category}/${k.id}`);
      console.log(`    skills: ${k.skills.join(", ")}`);
    }
    return;
  }

  const cwd = process.cwd();
  const target = resolveTarget(opts, cwd);
  if (!target) {
    console.error("Error: pass a target, e.g. --claude or --path .agents/skills");
    process.exitCode = 1;
    return;
  }

  let kits;
  try {
    kits = selectKits(catalog, opts);
  } catch (e) {
    console.error("Error:", e.message);
    process.exitCode = 1;
    return;
  }
  if (!kits.length) {
    console.error("Error: no kits selected");
    process.exitCode = 1;
    return;
  }

  console.log(`agentic-awesome-kits — ${opts.dryRun ? "dry-run" : "install"}`);
  console.log(`  project: ${cwd}`);
  console.log(`  target:  ${target.name} → ${target.skillsDir || target.root}`);
  console.log(`  kits:    ${kits.map((k) => k.id).join(", ")}`);

  let total = 0;
  for (const k of kits) {
    console.log(`\n[${k.category}/${k.id}]`);
    const r = installKit(k, target, opts.force, opts.dryRun);
    total += r.written;
  }

  if (!opts.dryRun) {
    const m = writeManifest(cwd, kits, target);
    console.log(`\n✓ Done (${total} files). Manifest: ${m}`);
    if (target.name === "claude") {
      console.log("\nFirst use examples:");
      console.log("  /dockerfile .NET 10 Minimal API --prod");
      console.log("  /log-check booking-api --env prod --since 1h");
      console.log("  /architecture TOPO overview");
    }
  } else {
    console.log("\n(dry-run) no files written");
  }
}

main();
