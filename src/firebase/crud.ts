import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { query, where } from 'firebase/firestore';

import { db } from './fire';

export interface WithId {
  id: string;
  [key: string]: any;
}

export const generateId = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 16 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length)),
  ).join('');
};

export const createData = async <T extends object>(
  collectionName: string,
  data: T,
): Promise<void> => {
  const id = generateId();
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { ...data, id });
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

export const readData = async <T = any>(
  collectionName: string,
  id: string,
): Promise<T | undefined> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as T;
    } else {
      console.warn('No such document!');
    }
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error('Error getting document:', error.message);
  }
};

export const readStatusData = async <T = any>(
  collectionName: string,
  status: string,
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where('status', '==', status));
    const querySnapshot = await getDocs(q);

    const dataArr: T[] = [];
    querySnapshot.forEach((docSnap) => {
      dataArr.push(docSnap.data() as T);
    });

    return dataArr;
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { ...data, id });
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
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log('Document successfully deleted!');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export const readAllData = async <T = any>(
  collectionName: string,
): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const dataArr: T[] = [];

    querySnapshot.forEach((docSnap) => {
      dataArr.push(docSnap.data() as T);
    });

    return dataArr;
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};

export const listenToCollection = <T = any>(
  collectionName: string,
  callback: (data: T[]) => void,
): (() => void) => {
  const collectionRef = collection(db, collectionName);

  return onSnapshot(collectionRef, (snapshot) => {
    const data: T[] = [];
    snapshot.forEach((docSnap) => {
      data.push(docSnap.data() as T);
    });
    callback(data);
  });
};
