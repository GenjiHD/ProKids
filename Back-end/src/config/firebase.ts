import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
export { db };

