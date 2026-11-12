import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminAppInstance: App | null = null;
let adminDbInstance: Firestore | null = null;
let adminAuthInstance: Auth | null = null;

export function cleanPrivateKey(rawKey?: string): string {
  if (!rawKey) return "";
  let key = rawKey.trim();

  // Strip wrapping single or double quotes if present
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Convert literal \n or escaped \\n to real newlines
  key = key.replace(/\\n/g, "\n");

  return key;
}

export function validatePrivateKeyFormat(rawKey?: string): {
  valid: boolean;
  hasBeginMarker: boolean;
  hasRealNewlines: boolean;
  hasWrappingQuotes: boolean;
  error?: string;
} {
  if (!rawKey || !rawKey.trim()) {
    return {
      valid: false,
      hasBeginMarker: false,
      hasRealNewlines: false,
      hasWrappingQuotes: false,
      error: "Private key is empty or missing",
    };
  }

  const trimmed = rawKey.trim();
  const hasWrappingQuotes =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));

  const cleaned = cleanPrivateKey(rawKey);
  const hasBeginMarker = cleaned.startsWith("-----BEGIN PRIVATE KEY-----");
  const hasRealNewlines = cleaned.includes("\n");

  const valid = hasBeginMarker && hasRealNewlines;

  return {
    valid,
    hasBeginMarker,
    hasRealNewlines,
    hasWrappingQuotes,
    error: valid
      ? undefined
      : "Private key must start with '-----BEGIN PRIVATE KEY-----' and contain real newlines",
  };
}

export function getMissingAdminEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.FIREBASE_PROJECT_ID?.trim()) missing.push("FIREBASE_PROJECT_ID");
  if (!process.env.FIREBASE_CLIENT_EMAIL?.trim()) missing.push("FIREBASE_CLIENT_EMAIL");
  if (!process.env.FIREBASE_PRIVATE_KEY?.trim()) missing.push("FIREBASE_PRIVATE_KEY");
  return missing;
}

export function initAdmin(): { app: App; db: Firestore; auth: Auth } {
  if (getApps().length > 0) {
    const existing = getApps()[0]!;
    adminAppInstance = existing;
    if (!adminDbInstance) adminDbInstance = getFirestore(existing);
    if (!adminAuthInstance) adminAuthInstance = getAuth(existing);
    return { app: adminAppInstance, db: adminDbInstance, auth: adminAuthInstance };
  }

  const missing = getMissingAdminEnv();
  if (missing.length > 0) {
    const err = `[Firebase Admin] Missing required environment variables: ${missing.join(", ")}`;
    throw new Error(err);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID!.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!.trim();
  const privateKey = cleanPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  const keyCheck = validatePrivateKeyFormat(privateKey);
  if (!keyCheck.valid) {
    throw new Error(`[Firebase Admin] Invalid private key format: ${keyCheck.error}`);
  }

  try {
    adminAppInstance = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firebase Admin] Failed to initialize App: ${msg}`);
  }

  adminDbInstance = getFirestore(adminAppInstance);
  adminAuthInstance = getAuth(adminAppInstance);

  return { app: adminAppInstance, db: adminDbInstance, auth: adminAuthInstance };
}

export function getAdminApp(): App {
  return initAdmin().app;
}

export function getAdminDb(): Firestore {
  return initAdmin().db;
}

export function getAdminAuth(): Auth {
  return initAdmin().auth;
}
