import { execSync } from "child_process";

export async function autoCommit(message: string) {
  try {
    execSync("git add .", { stdio: "inherit" });
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });

    console.log("✅ Code committed & pushed");
  } catch (err) {
    console.log("⚠️ Git commit failed");
  }
}
