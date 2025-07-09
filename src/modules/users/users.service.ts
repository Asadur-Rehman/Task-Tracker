import { Injectable, NotFoundException } from '@nestjs/common';
import { admin, db } from '../../firebase/firebase-admin';
import { User } from './entities/user.model';
import { AuthService } from '../auth/auth.service';

export interface FirebaseLoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
}

@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService) {}

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

  async createUser(
    email: string,
    password: string,
    userData: Partial<User>,
  ): Promise<User> {
    const userRecord = await this.authService.createUser(
      email,
      password,
      userData,
    );

    const now = new Date();
    const newUser: User = {
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

  async getUser(uid: string): Promise<User | null> {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return doc.data() as User;
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.authService.verifyIdToken(idToken);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<User> {
    const userDoc = db.collection('users').doc(uid);
    const snapshot = await userDoc.get();

    if (!snapshot.exists) {
      throw new NotFoundException('User not found');
    }

    const updatedAt = new Date();
    await userDoc.update({ ...updates, updatedAt });

    const updatedSnapshot = await userDoc.get();
    return updatedSnapshot.data() as User;
  }
}
