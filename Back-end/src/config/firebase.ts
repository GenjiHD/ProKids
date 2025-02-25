import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Cargar las credenciales del archivo JSON
const serviceAccount = require("../../serviceAccountKey.json"); // Ruta al archivo JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
export { db };

