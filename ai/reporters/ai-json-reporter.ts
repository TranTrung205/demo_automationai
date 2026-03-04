import fs from "fs";
import path from "path";

export interface AIStepLog {
  id: string;
  description: string;
  action: string;
  target: string;
  value?: string;

  status: "passed" | "failed" | "healed";

  error?: string;
  retryCount?: number;
  confidence?: number;

  timestamp: number;
}

export interface AIReport {
  runId: string;
  testName: string;

  startedAt: number;
  finishedAt: number;
  durationMs: number;

  success: boolean;

  steps: AIStepLog[];

  metadata?: {
    model?: string;
    visionEnabled?: boolean;
    plannerVersion?: string;
  };
}

const REPORT_DIR = path.join(process.cwd(), "ai-report");

function ensureDir() {
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

export function saveAIReport(report: AIReport) {

  ensureDir();

  const fileName =
    report.testName.replace(/\s+/g, "_") +
    "_" +
    report.runId +
    ".json";

  const filePath = path.join(REPORT_DIR, fileName);

  fs.writeFileSync(
    filePath,
    JSON.stringify(report, null, 2)
  );

  console.log("📊 AI Report saved:", filePath);
}

export function createReport(testName: string): AIReport {

  return {
    runId: Date.now().toString(),
    testName,
    startedAt: Date.now(),
    finishedAt: 0,
    durationMs: 0,
    success: false,
    steps: [],
    metadata: {
      plannerVersion: "v10"
    }
  };
}

export function finalizeReport(
  report: AIReport,
  success: boolean
) {

  report.finishedAt = Date.now();
  report.durationMs =
    report.finishedAt - report.startedAt;

  report.success = success;
}

export function logStep(
  report: AIReport,
  step: AIStepLog
) {
  report.steps.push(step);
}