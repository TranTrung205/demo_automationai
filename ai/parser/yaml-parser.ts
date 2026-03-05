import fs from "fs/promises";
import yaml from "js-yaml";

export async function parseYaml(filePath: string) {

  const file = await fs.readFile(filePath, "utf8");

  const data: any = yaml.load(file);

  if (!data) {
    throw new Error("❌ YAML parsing failed");
  }

  const name = data.name;
  const page = data.page;
  const steps = data.steps || [];

  if (!name) {
    throw new Error("❌ YAML missing 'name'");
  }

  if (!page) {
    throw new Error("❌ YAML missing 'page'");
  }

  if (!Array.isArray(steps)) {
    throw new Error("❌ YAML steps must be array");
  }

  return {
    name,
    page,
    steps
  };
}