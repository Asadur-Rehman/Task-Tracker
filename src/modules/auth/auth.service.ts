import { Injectable } from '@nestjs/common';
import { auth, db } from '../../firebase/firebase-admin';
import { UserRecord } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
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
