import fs from "fs";
import path from "path";
import { runAllHealthChecks } from "../lib/health/checker";

// Load .env.local if not already in environment
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined || process.env[key] === "") {
        process.env[key] = val;
      }
    }
  }
}

async function main() {
  console.log("\n=======================================================");
  console.log("       BUILT2HOST SYSTEM HEALTH CHECK REPORT          ");
  console.log("=======================================================\n");

  const report = await runAllHealthChecks();

  let passCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const check of report.checks) {
    const badge =
      check.status === "pass"
        ? "[ PASS ]"
        : check.status === "fail"
        ? "[ FAIL ]"
        : "[ SKIP ]";

    console.log(`${badge} ${check.name} (${check.id})`);

    if (check.details) {
      console.log(`         Details: ${JSON.stringify(check.details)}`);
    }

    if (check.error) {
      console.log(`         Error:   ${check.error}`);
    }

    if (check.hint) {
      console.log(`         Hint:    ${check.hint}`);
    }

    console.log("");

    if (check.status === "pass") passCount++;
    else if (check.status === "fail") failCount++;
    else skipCount++;
  }

  console.log("-------------------------------------------------------");
  console.log(
    `Summary: ${passCount} Passed | ${failCount} Failed | ${skipCount} Skipped`
  );
  console.log(
    `Overall Status: ${report.ok ? "ALL SYSTEMS OPERATIONAL (GREEN)" : "ACTION REQUIRED (RED)"}`
  );
  console.log("=======================================================\n");

  if (!report.ok) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Health check execution error:", err);
  process.exit(1);
});
