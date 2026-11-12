import {
  initAdmin,
  getAdminDb,
  getAdminAuth,
  cleanPrivateKey,
  validatePrivateKeyFormat,
} from "@/lib/firebase/admin";
import { getEmailTransporter } from "@/lib/email/transport";

export interface HealthCheckItem {
  id: string;
  name: string;
  passed: boolean;
  status: "pass" | "fail" | "skip";
  details?: Record<string, any>;
  hint?: string;
  error?: string;
}

export interface HealthReport {
  ok: boolean;
  timestamp: string;
  checks: HealthCheckItem[];
}

export async function runAllHealthChecks(): Promise<HealthReport> {
  const checks: HealthCheckItem[] = [];

  // Check 1: Env Presence
  const requiredEnvKeys = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "IP_HASH_SALT",
    "SMTP_USER",
    "SMTP_APP_PASSWORD",
    "MAIL_FROM",
    "ADMIN_EMAILS",
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  const envPresenceDetails: Record<string, boolean> = {};
  const missingEnvKeys: string[] = [];

  for (const key of requiredEnvKeys) {
    const val = process.env[key];
    const isPresent = Boolean(val && val.trim().length > 0);
    envPresenceDetails[key] = isPresent;
    if (!isPresent) {
      missingEnvKeys.push(key);
    }
  }

  const envPresencePassed = missingEnvKeys.length === 0;
  checks.push({
    id: "env-presence",
    name: "Environment Variables Presence",
    passed: envPresencePassed,
    status: envPresencePassed ? "pass" : "fail",
    details: envPresenceDetails,
    hint: envPresencePassed
      ? undefined
      : `Missing required variables: ${missingEnvKeys.join(", ")}. Populate these in .env.local.`,
  });

  // Check 2: Private Key Format
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!rawKey || !rawKey.trim()) {
    checks.push({
      id: "private-key-format",
      name: "Private Key Format Validation",
      passed: false,
      status: "fail",
      hint: "FIREBASE_PRIVATE_KEY is missing from environment. Add your service account private key.",
    });
  } else {
    const keyValidation = validatePrivateKeyFormat(rawKey);
    const cleaned = cleanPrivateKey(rawKey);
    const hasBeginMarker = cleaned.startsWith("-----BEGIN PRIVATE KEY-----");
    const hasRealNewlines = cleaned.includes("\n");
    const passed = keyValidation.valid && !keyValidation.hasWrappingQuotes;

    checks.push({
      id: "private-key-format",
      name: "Private Key Format Validation",
      passed,
      status: passed ? "pass" : "fail",
      details: {
        startsMarker: hasBeginMarker,
        containsNewlines: hasRealNewlines,
        outerQuotesStripped: !keyValidation.hasWrappingQuotes,
      },
      hint: passed
        ? undefined
        : "Private key must start with '-----BEGIN PRIVATE KEY-----', contain real newlines after \\n conversion, and have no surrounding quotes left inside the value.",
    });
  }

  // Check 3: Project Match
  const projId = (process.env.FIREBASE_PROJECT_ID || "").trim();
  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || "").trim();
  if (!projId || !clientEmail) {
    checks.push({
      id: "project-match",
      name: "Project Match Verification",
      passed: false,
      status: "fail",
      hint: "FIREBASE_PROJECT_ID or FIREBASE_CLIENT_EMAIL missing.",
    });
  } else {
    const expectedDomain = `@${projId}.iam.gserviceaccount.com`;
    const endsWithProject = clientEmail.endsWith(expectedDomain);
    const nextPublicMatches = (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim() === projId;
    const passed = endsWithProject && nextPublicMatches;

    checks.push({
      id: "project-match",
      name: "Project Match Verification",
      passed,
      status: passed ? "pass" : "fail",
      details: {
        projectId: projId,
        clientEmailDomainMatches: endsWithProject,
        clientEmailAccount: clientEmail.split("@")[0] || "",
        nextPublicProjectMatches: nextPublicMatches,
      },
      hint: passed
        ? undefined
        : `FIREBASE_CLIENT_EMAIL must end with '${expectedDomain}' and match FIREBASE_PROJECT_ID (${projId}).`,
    });
  }

  // Check 4: Admin SDK Init
  let adminInitSucceeded = false;
  try {
    initAdmin();
    adminInitSucceeded = true;
    checks.push({
      id: "admin-sdk-init",
      name: "Firebase Admin SDK Initialization",
      passed: true,
      status: "pass",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    checks.push({
      id: "admin-sdk-init",
      name: "Firebase Admin SDK Initialization",
      passed: false,
      status: "fail",
      error: msg,
      hint: "Firebase Admin failed to initialize. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    });
  }

  // Check 5: Firestore Round Trip
  if (!adminInitSucceeded) {
    checks.push({
      id: "firestore-roundtrip",
      name: "Firestore Round-trip Verification",
      passed: false,
      status: "skip",
      hint: "Skipped: Firebase Admin SDK initialization failed.",
    });
  } else {
    try {
      const db = getAdminDb();
      const testId = `health_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const docRef = db.collection("_healthcheck").doc(testId);

      await docRef.set({
        probeAt: new Date().toISOString(),
        test: true,
      });

      const snap = await docRef.get();
      if (!snap.exists || snap.data()?.test !== true) {
        throw new Error("Read back verification failed");
      }

      await docRef.delete();

      checks.push({
        id: "firestore-roundtrip",
        name: "Firestore Round-trip Verification",
        passed: true,
        status: "pass",
        details: {
          testCollection: "_healthcheck",
          roundTripSuccess: true,
        },
      });
    } catch (err: any) {
      const msg = err?.message || String(err);
      const code = err?.code;

      let hint = `Firestore write/read test failed: ${msg}`;
      if (code === 5 || code === "NOT_FOUND" || msg.includes("NOT_FOUND") || msg.includes("not found")) {
        hint = "Firestore database not created in this project (create it in Native mode, asia-south1)";
      } else if (
        code === 7 ||
        code === "PERMISSION_DENIED" ||
        msg.includes("PERMISSION_DENIED") ||
        msg.includes("Datastore")
      ) {
        hint = "the service account lacks the Cloud Datastore User role or the Firestore API is disabled";
      } else if (
        code === 16 ||
        code === "UNAUTHENTICATED" ||
        msg.includes("invalid_grant") ||
        msg.includes("UNAUTHENTICATED")
      ) {
        hint = "bad private key or system clock problem";
      }

      checks.push({
        id: "firestore-roundtrip",
        name: "Firestore Round-trip Verification",
        passed: false,
        status: "fail",
        error: msg,
        hint,
      });
    }
  }

  // Check 6: Firebase Auth Verification & Admin Allowlist Check
  if (!adminInitSucceeded) {
    checks.push({
      id: "auth-users",
      name: "Firebase Auth & Admin Allowlist",
      passed: false,
      status: "skip",
      hint: "Skipped: Firebase Admin SDK initialization failed.",
    });
  } else {
    try {
      const auth = getAdminAuth();
      await auth.listUsers(1);

      // Check allowlisted admin emails
      const rawAdminEmails = process.env.ADMIN_EMAILS || "";
      const adminEmails = rawAdminEmails
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const existingUsers: string[] = [];
      const missingUsers: string[] = [];

      for (const email of adminEmails) {
        try {
          const userRecord = await auth.getUserByEmail(email);
          if (userRecord?.email) {
            existingUsers.push(userRecord.email);
          }
        } catch {
          missingUsers.push(email);
        }
      }

      const passed = missingUsers.length === 0;

      checks.push({
        id: "auth-users",
        name: "Firebase Auth & Admin Allowlist",
        passed,
        status: passed ? "pass" : "fail",
        details: {
          authEnabled: true,
          adminEmailsFoundInAuth: existingUsers,
          adminEmailsMissingInAuth: missingUsers,
        },
        hint: passed
          ? undefined
          : `Allowlisted admin emails missing from Firebase Auth: ${missingUsers.join(", ")}. Create them in Firebase Console > Authentication > Users > Add user.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      checks.push({
        id: "auth-users",
        name: "Firebase Auth & Admin Allowlist",
        passed: false,
        status: "fail",
        error: msg,
        hint: "Firebase Authentication is not enabled. Go to Firebase Console > Authentication > Get started and enable Email/Password provider.",
      });
    }
  }

  // Check 7: SMTP Verification
  try {
    const transporter = getEmailTransporter();
    if (!transporter) {
      checks.push({
        id: "smtp-verification",
        name: "Gmail SMTP Transport Verification",
        passed: false,
        status: "fail",
        hint: "SMTP_USER and SMTP_APP_PASSWORD are required in .env.local (use a 16-character App Password with 2-Step Verification on, not the normal Gmail password).",
      });
    } else {
      await transporter.verify();
      checks.push({
        id: "smtp-verification",
        name: "Gmail SMTP Transport Verification",
        passed: true,
        status: "pass",
        details: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
        },
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    checks.push({
      id: "smtp-verification",
      name: "Gmail SMTP Transport Verification",
      passed: false,
      status: "fail",
      error: msg,
      hint: "use a 16-character App Password with 2-Step Verification on, not the normal Gmail password",
    });
  }

  // Check 8: Composite Index Check
  if (!adminInitSucceeded) {
    checks.push({
      id: "index-check",
      name: "Firestore Composite Index (division + createdAt desc)",
      passed: false,
      status: "skip",
      hint: "Skipped: Firebase Admin SDK initialization failed.",
    });
  } else {
    try {
      const db = getAdminDb();
      await db
        .collection("enquiries")
        .where("division", "==", "websites")
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      checks.push({
        id: "index-check",
        name: "Firestore Composite Index (division + createdAt desc)",
        passed: true,
        status: "pass",
      });
    } catch (err: any) {
      const msg = err?.message || String(err);
      const indexUrlMatch = msg.match(/https:\/\/console\.firebase\.google\.com[^\s\)]+/);

      if (msg.includes("FAILED_PRECONDITION") || msg.includes("index") || indexUrlMatch) {
        checks.push({
          id: "index-check",
          name: "Firestore Composite Index (division + createdAt desc)",
          passed: false,
          status: "fail",
          details: {
            indexCreationLink: indexUrlMatch ? indexUrlMatch[0] : null,
          },
          hint: indexUrlMatch
            ? `Firestore composite index missing. Create it at: ${indexUrlMatch[0]}`
            : "Firestore composite index missing for (division + createdAt desc). Deploy firestore.indexes.json via 'firebase deploy --only firestore:indexes'.",
        });
      } else {
        checks.push({
          id: "index-check",
          name: "Firestore Composite Index (division + createdAt desc)",
          passed: false,
          status: "fail",
          error: msg,
          hint: `Query check failed: ${msg}`,
        });
      }
    }
  }

  const ok = checks.every((c) => c.passed);

  return {
    ok,
    timestamp: new Date().toISOString(),
    checks,
  };
}
