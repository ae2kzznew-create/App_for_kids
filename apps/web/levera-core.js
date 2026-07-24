/*__CORE_START__*/
const FOLDERS = { goal: "goals", skill: "skills", quest: "quests", weekly_review: "reviews" };
const MANAGED = {
  goal: ["levera_id","levera_type","profile_id","status","updated"],
  skill: ["levera_id","levera_type","goal_id","status","support_level","mastery_score","next_review_at","updated"],
  quest: ["levera_id","levera_type","skill_ids","status","support_level","xp_reward","maintenance","scheduled_for","completed_at","updated"],
  weekly_review: ["levera_id","levera_type","profile_id","week_start","completed_at"],
};
function parseValue(raw){
  if (raw.startsWith('"') || raw.startsWith("[") || raw.startsWith("{")) { try { return JSON.parse(raw); } catch { throw new Error("Invalid YAML value: " + raw); } }
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw;
}
function parseFrontmatter(value){
  const fields = {};
  for (const line of value.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error("Invalid YAML line: " + line);
    fields[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1).trim());
  }
  return fields;
}
function isLeveraDocument(content){
  const value = content.trim();
  return value.startsWith("---") && /(^|\n)levera_id\s*:/.test(value);
}
function parseDocument(markdown){
  const match = markdown.trim().match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442 \u0434\u043e\u043b\u0436\u0435\u043d \u043d\u0430\u0447\u0438\u043d\u0430\u0442\u044c\u0441\u044f \u0441 YAML frontmatter");
  const fields = parseFrontmatter(match[1] || "");
  const body = (match[2] || "").trim();
  const id = typeof fields.levera_id === "string" ? fields.levera_id.trim() : "";
  const type = typeof fields.levera_type === "string" ? fields.levera_type.trim() : "";
  if (!id) throw new Error("\u041d\u0435\u0442 levera_id");
  if (!(type in FOLDERS)) throw new Error("\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 levera_type: " + type);
  const title = (body.match(/^#\s+(.+)$/m) || [])[1];
  return { id, type, title: (title || id).trim(), body, fields };
}
function descriptionBody(body){ return body.replace(/^#\s+.+\r?\n?/, "").trim(); }
function section(body, heading){
  const match = body.match(new RegExp("^## " + heading + "\\r?\\n\\r?\\n([\\s\\S]*?)(?=\\r?\\n\\r?\\n## |$)", "m"));
  return match && match[1] ? match[1].trim() : "";
}
function yamlValue(value){
  if (Array.isArray(value)) return "[" + value.map((item) => JSON.stringify(item)).join(", ") + "]";
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}
function buildFrontmatter(type, managedValues, preserved){
  const lines = [];
  for (const key of MANAGED[type]) {
    const value = managedValues[key];
    if (value === undefined || value === null) continue;
    lines.push(key + ": " + yamlValue(value));
  }
  for (const key of Object.keys(preserved || {})) {
    if (MANAGED[type].includes(key)) continue;
    const value = preserved[key];
    if (value === undefined) continue;
    lines.push(key + ": " + yamlValue(value));
  }
  return lines.join("\n");
}
function slug(value){
  return value.toLowerCase().trim().replace(/[^a-z0-9\u0400-\u04ff]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "item";
}
function safeId(value){ return value.replace(/[^a-zA-Z0-9_-]/g, "_"); }
const VAULT_ROOT_FOLDER = "Levera";
function entityFileName(type, id, title){
  return VAULT_ROOT_FOLDER + "/" + FOLDERS[type] + "/" + safeId(id) + "-" + slug(title) + ".md";
}
function legacyEntityFileName(type, id, title){
  return FOLDERS[type] + "__" + safeId(id) + "-" + slug(title) + ".md";
}
function buildMarkdown(type, managedValues, preserved, heading, body){
  const frontmatter = buildFrontmatter(type, managedValues, preserved);
  const trimmed = (body || "").trim();
  return "---\n" + frontmatter + "\n---\n\n# " + heading + "\n" + (trimmed ? "\n" + trimmed + "\n" : "");
}
function reviewBody(achievements, blockers, decisions){
  return [achievements ? "## Achievements\n\n" + achievements : "", blockers ? "## Blockers\n\n" + blockers : "", "## Decision\n\n" + decisions].filter(Boolean).join("\n\n");
}
function newId(prefix){
  return prefix + "_web_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}
function mondayOf(date){
  const value = new Date(date);
  const day = (value.getDay() + 6) % 7;
  value.setDate(value.getDate() - day);
  const pad = (part) => String(part).padStart(2, "0");
  return value.getFullYear() + "-" + pad(value.getMonth() + 1) + "-" + pad(value.getDate());
}
if (typeof module !== "undefined") module.exports = { parseDocument, isLeveraDocument, buildMarkdown, entityFileName, legacyEntityFileName, descriptionBody, section, reviewBody, slug, safeId, mondayOf, buildFrontmatter };
/*__CORE_END__*/
