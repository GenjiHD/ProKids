import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

let serviceAccount: admin.ServiceAccount;

// Si está definida la variable de entorno, usarla
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8');
  serviceAccount = JSON.parse(decoded);
} else {
  // Leer el archivo base64 local
  const base64Path = path.resolve(__dirname, '../serviceAccountKey.base64.txt');
  const base64 = fs.readFileSync(base64Path, 'utf8');
  const decoded = Buffer.from(base64, 'base64').toString('utf8');
  serviceAccount = JSON.parse(decoded);
}

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
export { db };
