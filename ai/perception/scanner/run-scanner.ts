import fs from "fs";
import path from "path";
import { scanDOM } from "./dom-scanner";

const OUTPUT_FILE = "dom/dom.json";

export async function runScanner(url: string) {

  console.log("🔍 Scanning DOM:", url);

  try {

    const dom = await scanDOM(url);

    const dir = path.dirname(OUTPUT_FILE);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(dom, null, 2),
      "utf-8"
    );

    console.log("✅ DOM saved:", OUTPUT_FILE);

  } catch (err: any) {

    console.error("❌ Scanner failed:", err.message);

  }
}


// CLI mode
if (require.main === module) {
  const url = process.argv[2] || "https://www.saucedemo.com";
  runScanner(url);
}