import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
