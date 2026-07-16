/**
 * Pack public kits from monorepo kits/ into this package's payload/.
 * Source of truth: kits/devops/*, kits/software/* only.
 *
 *   node packages/agentic-awesome-kits/scripts/pack-kits.mjs
 *   # or: npm run pack
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.join(__dirname, "..");
const REPO = path.join(PKG, "..", "..");
const KITS_ROOT = path.join(REPO, "kits");
const PAYLOAD = path.join(PKG, "payload");

/** Kit folders look like: kits/{category}/{kit-name}/ with .claude/ */
function discoverKits() {
  const kits = [];
  if (!fs.existsSync(KITS_ROOT)) {
    throw new Error(`Missing kits/ at ${KITS_ROOT}`);
  }
  for (const cat of fs.readdirSync(KITS_ROOT, { withFileTypes: true })) {
    if (!cat.isDirectory() || cat.name.startsWith(".")) continue;
    const catPath = path.join(KITS_ROOT, cat.name);
    for (const ent of fs.readdirSync(catPath, { withFileTypes: true })) {
      if (!ent.isDirectory()) continue;
      const kitPath = path.join(catPath, ent.name);
      const claude = path.join(kitPath, ".claude");
      if (!fs.existsSync(claude)) continue; // skip category-only folders without kit shape
      kits.push({
        id: ent.name,
        category: cat.name,
        root: kitPath,
      });
    }
  }
  return kits.sort((a, b) =>
    a.category === b.category
      ? a.id.localeCompare(b.id)
      : a.category.localeCompare(b.category),
  );
}

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function copyDir(src, dest, { skip = [] } = {}) {
  if (!fs.existsSync(src)) return 0;
  ensureDir(dest);
  let n = 0;
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.includes(ent.name)) continue;
    if (ent.name === "node_modules" || ent.name === ".git") continue;
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) n += copyDir(s, d, { skip });
    else {
      fs.copyFileSync(s, d);
      n += 1;
    }
  }
  return n;
}

function listSkills(kitRoot) {
  const skillsDir = path.join(kitRoot, ".claude", "skills");
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function main() {
  console.log("pack-kits from", path.relative(REPO, KITS_ROOT));
  const kits = discoverKits();
  if (kits.length === 0) {
    console.error("No kits found under kits/{category}/{kit}/.claude");
    process.exit(1);
  }

  // Clean payload (keep structure)
  fs.rmSync(PAYLOAD, { recursive: true, force: true });
  ensureDir(path.join(PAYLOAD, "kits"));

  const catalog = {
    version: "0.1.0-dev",
    packedAt: new Date().toISOString(),
    source: "kits/",
    kits: [],
  };

  let files = 0;
  for (const kit of kits) {
    const out = path.join(PAYLOAD, "kits", kit.category, kit.id);
    ensureDir(out);
    // Standard kit shape only: .claude + _templates (+ optional assets present in public kits)
    files += copyDir(path.join(kit.root, ".claude"), path.join(out, ".claude"));
    files += copyDir(path.join(kit.root, "_templates"), path.join(out, "_templates"));
    // Optional public kit assets (drawio scripts/data/styles/references/brain)
    for (const extra of [
      "references",
      "scripts",
      "styles",
      "data",
      "README.md",
      "LICENSE-drawio-skill",
    ]) {
      const p = path.join(kit.root, extra);
      if (!fs.existsSync(p)) continue;
      const dest = path.join(out, extra);
      if (fs.statSync(p).isDirectory()) files += copyDir(p, dest);
      else {
        fs.copyFileSync(p, dest);
        files += 1;
      }
    }
    // brain md at kit root
    for (const f of fs.readdirSync(kit.root)) {
      if (f.endsWith("-BRAIN.md") || f === "ZABBIX-BRAIN.md" || f === "ELK-BRAIN.md" || f === "GRAFANA-BRAIN.md" || f === "DRAWIO-BRAIN.md") {
        fs.copyFileSync(path.join(kit.root, f), path.join(out, f));
        files += 1;
      }
    }

    const skills = listSkills(kit.root);
    catalog.kits.push({
      id: kit.id,
      category: kit.category,
      skills,
      path: `kits/${kit.category}/${kit.id}`,
    });
    console.log(`  + ${kit.category}/${kit.id} (${skills.length} skills)`);
  }

  catalog.categories = [...new Set(catalog.kits.map((k) => k.category))].sort();
  catalog.skillCount = catalog.kits.reduce((n, k) => n + k.skills.length, 0);

  fs.writeFileSync(
    path.join(PAYLOAD, "catalog.json"),
    JSON.stringify(catalog, null, 2) + "\n",
  );

  // Category "bundles" = install whole category
  ensureDir(path.join(PAYLOAD, "bundles"));
  for (const cat of catalog.categories) {
    const ids = catalog.kits.filter((k) => k.category === cat).map((k) => k.id);
    fs.writeFileSync(
      path.join(PAYLOAD, "bundles", `${cat}.json`),
      JSON.stringify(
        {
          id: cat,
          name: cat,
          description: `All kits under kits/${cat}/`,
          kits: ids,
        },
        null,
        2,
      ) + "\n",
    );
  }
  // all
  fs.writeFileSync(
    path.join(PAYLOAD, "bundles", "all.json"),
    JSON.stringify(
      {
        id: "all",
        name: "All public kits",
        description: "Every kit under kits/",
        kits: catalog.kits.map((k) => k.id),
      },
      null,
      2,
    ) + "\n",
  );

  console.log(
    `\nDone. ${catalog.kits.length} kits, ${catalog.skillCount} skills, ${files} files → payload/`,
  );
}

main();
