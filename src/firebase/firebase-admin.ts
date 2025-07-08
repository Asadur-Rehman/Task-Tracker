import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

import serviceAccount from './firebase-service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
