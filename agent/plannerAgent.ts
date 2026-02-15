export interface TestPlan {
  testName: string;
  steps: string[];
}

export async function plannerAgent(): Promise<TestPlan> {
  console.log("🧠 Planner Agent running (FREE MODE)");

  return {
    testName: "login success",
    steps: [
      "Go to login page",
      "Fill username",
      "Fill password",
      "Click login",
      "Verify dashboard"
    ]
  };
}
