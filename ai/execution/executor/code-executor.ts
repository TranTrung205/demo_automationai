import { Page } from "playwright";

export async function executeSteps(
  page: Page,
  stepCodes: string[]
) {

  try {

    for (let i = 0; i < stepCodes.length; i++) {

      const code = stepCodes[i];

      console.log(`▶️ Executing step ${i + 1}`);

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(300);

      const fn = new Function(
        "page",
        `
        return (async () => {
          try {
            ${code}
          } catch (err) {
            err.stepIndex = ${i};
            throw err;
          }
        })();
        `
      );

      await fn(page);
    }

    return {
      success: true
    };

  } catch (err: any) {

    console.error("❌ Step execution failed");

    return {
      success: false,
      failedIndex: detectFailedIndex(err),
      output: err?.message || String(err)
    };
  }
}

function detectFailedIndex(err: any) {
  return err?.stepIndex ?? 0;
}