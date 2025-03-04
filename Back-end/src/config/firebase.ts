import * as admin from 'firebase-admin';

// Inicializa la aplicación de Firebase con las credenciales del servicio
admin.initializeApp({
  credential: admin.credential.cert('./Back-end/src/serviceAccountKey.json'), // Ruta al archivo de credenciales JSON
});

const db = admin.firestore(); // Obtener la instancia de Firestore

export { db };
