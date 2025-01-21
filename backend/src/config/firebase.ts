import type { ServiceAccount } from "firebase-admin";
import { apps } from "firebase-admin";
import { initializeApp, cert } from "firebase-admin/app";

const PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

const initializeFBApp = () => {
  apps.length === 0 &&
    initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
};

export default initializeFBApp;
