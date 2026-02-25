import fs from "fs";
import path from "path";

export interface AIStepLog {
  id: string;
  description: string;
  action: string;
  target: string;
  value?: string;
  status: "passed" | "failed";
  error?: string;
  timestamp: number;
}

export interface AIReport {
  testName: string;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  success: boolean;
  steps: AIStepLog[];
  metadata?: any;
}

const REPORT_DIR = path.join(process.cwd(), "ai-report");

/**
 * Ensure report folder exists
 */
function ensureDir() {
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

/**
 * Save AI report JSON
 */
export function saveAIReport(report: AIReport) {

  ensureDir();

  const fileName =
    report.testName.replace(/\s+/g, "_") +
    "_" +
    Date.now() +
    ".json";

  const filePath = path.join(REPORT_DIR, fileName);

  fs.writeFileSync(
    filePath,
    JSON.stringify(report, null, 2)
  );

  console.log("📊 AI Report saved:", filePath);
}

/**
 * Create empty report
 */
export function createReport(testName: string): AIReport {

  return {
    testName,
    startedAt: Date.now(),
    finishedAt: 0,
    durationMs: 0,
    success: false,
    steps: [],
    metadata: {}
  };
}

/**
 * Finalize report
 */
export function finalizeReport(report: AIReport, success: boolean) {

  report.finishedAt = Date.now();
  report.durationMs =
    report.finishedAt - report.startedAt;

  report.success = success;
}

/**
 * Push step log into report
 */
export function logStep(
  report: AIReport,
  step: AIStepLog
) {
  report.steps.push(step);
}