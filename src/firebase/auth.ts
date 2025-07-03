// src/firebase/auth.ts
import { auth, db } from './firebase-admin';

export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid Firebase ID token');
  }
};

export const createUser = async (
  email: string,
  password: string,
  userData: any,
) => {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    await db
      .collection('users')
      .doc(userRecord.uid)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .set({
        ...userData,
        uid: userRecord.uid,
      });

    return userRecord;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error('User not found with email:', email);
    throw error;
  }
};
