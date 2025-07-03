// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { auth, db } from '../../firebase/firebase-admin';
import { FirebaseUser } from './entities/user.model';

@Injectable()
export class UserService {
  async createUser(
    email: string,
    password: string,
    userData: Partial<FirebaseUser>,
  ) {
    const userRecord = await auth.createUser({
      email,
      password,
    });

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

  async verifyToken(idToken: string): Promise<any> {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}
