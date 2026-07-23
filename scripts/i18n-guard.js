#!/usr/bin/env node
/**
 * PostToolUse hook (Write|Edit). Warns when a new name/description/tagline/
 * etc. literal shows up in src/game/data/items/** — the one content category
 * that has already been migrated to the typed i18n dictionaries under
 * src/i18n/content/items.*.ts. A literal here would silently bypass
 * translation instead of being added as a key.
 *
 * Other content categories (npcs, quests, skills, talents, ...) haven't been
 * migrated yet, so this intentionally stays silent for them — there's no
 * point flagging a known, accepted backlog.
 */
const fs = require("fs");
const path = require("path");

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function main() {
  let input;
  try {
    input = JSON.parse(readStdin() || "{}");
  } catch {
    return;
  }

  const filePath = input?.tool_input?.file_path || input?.tool_response?.filePath;
  if (!filePath) return;

  const normalized = filePath.replace(/\\/g, "/");
  const isMigratedItemsFile =
    /\/src\/game\/data\/items\/.*\.ts$/.test(normalized) && !normalized.includes("__tests__");
  if (!isMigratedItemsFile) return;

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  const TEXT_KEYS = ["name", "description", "tagline", "blurb", "label", "title", "flavor"];
  const keyPattern = new RegExp(`\\b(${TEXT_KEYS.join("|")})\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g");

  const found = [];
  let m;
  while ((m = keyPattern.exec(content))) {
    const value = m[2];
    // Heuristic: real prose has a space. Ids/enums in this codebase
    // (e.g. "main_hand", "saber_single") never do.
    if (!value.includes(" ")) continue;
    found.push(value);
  }
  if (found.length === 0) return;

  const repoRoot = path.resolve(__dirname, "..");
  const dictFiles = ["items.en.ts", "items.es.ts", "items.fr.ts"].map((f) =>
    path.join(repoRoot, "src", "i18n", "content", f),
  );
  const dictText = dictFiles.map((f) => {
    try {
      return fs.readFileSync(f, "utf8");
    } catch {
      return "";
    }
  });

  const missing = [...new Set(found)].filter((value) => !dictText.some((d) => d.includes(value)));
  if (missing.length === 0) return;

  process.stderr.write(
    `New item name/description literal(s) detected in ${filePath}: ${missing
      .map((v) => JSON.stringify(v))
      .join(", ")}. This category already has typed i18n dictionaries — add a translation key to ` +
      `src/i18n/content/items.types.ts and a translated entry to items.en.ts/items.es.ts/items.fr.ts ` +
      `(see existing entries for the pattern), instead of leaving the string hardcoded in the data file.\n`,
  );
  process.exit(2);
}

main();
