import { Injectable } from '@nestjs/common';
import { auth, db } from '../../firebase/firebase-admin';
import { UserRecord } from 'firebase-admin/auth';

export interface FirebaseLoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
}

@Injectable()
export class AuthService {
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
    return data;
  }

  async verifyIdToken(token: string) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid Firebase ID token');
    }
  }

  async createUser(
    email: string,
    password: string,
    userData: any,
  ): Promise<UserRecord> {
    try {
      const userRecord = await auth.createUser({ email, password });

      await db
        .collection('users')
        .doc(userRecord.uid)
        .set({
          ...userData,
          uid: userRecord.uid,
        });

      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserRecord> {
    try {
      return await auth.getUserByEmail(email);
    } catch (error) {
      console.error('User not found with email:', email);
      throw error;
    }
  }
}
