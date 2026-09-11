import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");
const htmlPath = resolve(distRoot, "index.html");
const errors = [];

if (!existsSync(htmlPath)) {
  errors.push("dist/index.html is missing");
} else {
  const html = readFileSync(htmlPath, "utf8");
  const localReferences = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => !/^(?:https?:|#|mailto:)/.test(value));

  for (const reference of localReferences) {
    const cleanReference = reference.split(/[?#]/, 1)[0];
    const target = resolve(distRoot, cleanReference);
    if (!existsSync(target) || !statSync(target).isFile()) {
      errors.push(`missing local asset: ${reference}`);
    }
  }

  if (!/<html\s+lang="ru"/.test(html)) errors.push("document language is missing");
  if (!/<meta\s+name="description"/.test(html)) errors.push("meta description is missing");
  if (!/<link\s+rel="canonical"/.test(html)) errors.push("canonical link is missing");

  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(image[0])) errors.push("an image is missing alt text");
    if (!/\swidth="\d+"/.test(image[0]) || !/\sheight="\d+"/.test(image[0])) {
      errors.push("an image is missing intrinsic dimensions");
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Static site validation passed");
