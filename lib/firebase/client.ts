import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

export function getMissingClientFirebaseEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
  return missing;
}

export function getClientFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Client Firebase SDK cannot be initialized on the server.");
  }

  if (getApps().length > 0) {
    return getApp();
  }

  const missing = getMissingClientFirebaseEnv();
  if (missing.length > 0) {
    console.warn(`[Firebase Client] Missing config env vars: ${missing.join(", ")}`);
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  return initializeApp(firebaseConfig);
}

export function getClientFirebaseAuth(): Auth {
  const app = getClientFirebaseApp();
  return getAuth(app);
}
