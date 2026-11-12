import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminAppInstance: App | null = null;
let adminDbInstance: Firestore | null = null;
let adminAuthInstance: Auth | null = null;

export function getMissingAdminEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.FIREBASE_PROJECT_ID) missing.push("FIREBASE_PROJECT_ID");
  if (!process.env.FIREBASE_CLIENT_EMAIL) missing.push("FIREBASE_CLIENT_EMAIL");
  if (!process.env.FIREBASE_PRIVATE_KEY) missing.push("FIREBASE_PRIVATE_KEY");
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

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const missing = getMissingAdminEnv();
  if (missing.length > 0) {
    const err = `[Firebase Admin] Missing required environment variables: ${missing.join(", ")}`;
    console.error(err);
    throw new Error(err);
  }

  // Handle both literal newlines and escaped "\n" characters in private key
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  adminAppInstance = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

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
