import { db } from './firebase-admin';

export interface WithId {
  id: string;
  [key: string]: any;
}

export const generateId = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 16 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
};

export const createData = async <T extends object>(
  collectionName: string,
  data: T,
): Promise<void> => {
  const id = generateId();
  try {
    const docRef = db.collection(collectionName).doc(id);
    await docRef.set({ ...data, id });
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

export const readData = async <T = any>(
  collectionName: string,
  id: string,
): Promise<T | undefined> => {
  try {
    const docRef = db.collection(collectionName).doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data() as T;
    } else {
      console.warn('No such document!');
    }
  } catch (error: any) {
    console.error('Error getting document:', error.message);
  }
};

export const readStatusData = async <T = any>(
  collectionName: string,
  status: string,
): Promise<T[]> => {
  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where('status', '==', status)
      .get();

    return querySnapshot.docs.map((doc) => doc.data() as T);
  } catch (error: any) {
    console.error('Error getting documents by status:', error.message);
    return [];
  }
};

export const updateData = async <T extends object>(
  collectionName: string,
  id: string,
  data: T,
): Promise<void> => {
  try {
    const docRef = db.collection(collectionName).doc(id);
    await docRef.update({ ...data });
    console.log('Document successfully updated!');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export const deleteData = async (
  collectionName: string,
  id: string,
): Promise<void> => {
  try {
    const docRef = db.collection(collectionName).doc(id);
    await docRef.delete();
    console.log('Document successfully deleted!');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export const readAllData = async <T = any>(
  collectionName: string,
): Promise<T[]> => {
  try {
    const querySnapshot = await db.collection(collectionName).get();
    return querySnapshot.docs.map((doc) => doc.data() as T);
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};
