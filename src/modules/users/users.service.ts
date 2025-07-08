import { Injectable, NotFoundException } from '@nestjs/common';
import { admin, auth, db } from '../../firebase/firebase-admin';
import { FirebaseUser } from './entities/user.model';

export interface FirebaseLoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
}

@Injectable()
export class UserService {
  async login(email: string, password: string): Promise<FirebaseLoginResponse> {
    const apiKey = process.env.FIREBASE_API_KEY;

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      const error = (await response.json()) as { error?: { message?: string } };
      throw new Error(error?.error?.message || 'Login failed');
    }

    const data = (await response.json()) as FirebaseLoginResponse;

    return {
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      localId: data.localId,
      email: data.email,
    };
  }

  async createUser(
    email: string,
    password: string,
    userData: Partial<FirebaseUser>,
  ): Promise<FirebaseUser> {
    const userRecord = await auth.createUser({ email, password });

    const now = new Date();
    const newUser: FirebaseUser = {
      uid: userRecord.uid,
      email: userRecord.email!,
      displayName: userRecord.displayName || '',
      photoURL: userRecord.photoURL || '',
      preferences: userData.preferences || {
        theme: 'light',
        tasksPerPage: 10,
        defaultSort: 'createdAt',
      },
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('users').doc(userRecord.uid).set(newUser);
    return newUser;
  }

  async getUser(uid: string): Promise<FirebaseUser | null> {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return doc.data() as FirebaseUser;
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  async updateUser(
    uid: string,
    updates: Partial<FirebaseUser>,
  ): Promise<FirebaseUser> {
    const userDoc = db.collection('users').doc(uid);
    const snapshot = await userDoc.get();

    if (!snapshot.exists) {
      throw new NotFoundException('User not found');
    }

    const updatedAt = new Date();
    await userDoc.update({ ...updates, updatedAt });

    const updatedSnapshot = await userDoc.get();
    return updatedSnapshot.data() as FirebaseUser;
  }
}
