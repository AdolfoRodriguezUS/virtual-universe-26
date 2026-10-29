import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const jsonPath = fileURLToPath(new URL("../notes/keynote-highlights.json", import.meta.url));

const data = JSON.parse(await readFile(jsonPath, "utf8"));
const highlights = Array.isArray(data.highlights) ? data.highlights : [];
const byTopic = new Map();

for (const highlight of highlights) {
  const topic = highlight?.topic ?? "Other";
  const title = highlight?.title ?? "(untitled)";
  if (!byTopic.has(topic)) byTopic.set(topic, []);
  byTopic.get(topic).push(title);
}

for (const [topic, titles] of byTopic) {
  console.log(topic);
  for (const title of titles) {
    console.log(`- ${title}`);
  }
  console.log("");
}
