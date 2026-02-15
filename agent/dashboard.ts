import fs from "fs";
import { exec } from "child_process";

export function generateDashboard(status: string, message: string) {
  const time = new Date().toLocaleString();

  const html = `
  <html>
  <head>
    <title>AI Test Agent Report</title>
    <style>
      body {
        font-family: Arial;
        padding: 40px;
        background: #0f172a;
        color: white;
      }
      .card {
        background: #1e293b;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
      }
      .pass { color: #22c55e; }
      .fail { color: #ef4444; }
    </style>
  </head>

  <body>
    <h1>🤖 AI Test Agent Dashboard</h1>

    <div class="card">
      <h2>Status: 
        <span class="${status === "PASS" ? "pass" : "fail"}">
          ${status}
        </span>
      </h2>
      <p><b>Time:</b> ${time}</p>
    </div>

    <div class="card">
      <h3>Message</h3>
      <pre>${message}</pre>
    </div>

  </body>
  </html>
  `;

  fs.writeFileSync("agent-report.html", html);
  console.log("📊 Dashboard generated: agent-report.html");

  // ✅ auto open browser
  exec('start "" "agent-report.html"');
}
