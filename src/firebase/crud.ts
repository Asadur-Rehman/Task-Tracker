import { db } from './firebase-admin';

export const createData = async <T extends object>(
  collectionName: string,
  data: T,
): Promise<string | null> => {
  try {
    const docRef = await db.collection(collectionName).add(data);
    await docRef.update({ id: docRef.id });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    return null;
  }
};

export async function readData<T>(
  collection: string,
  id: string,
): Promise<T | null> {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as T;
}

export async function readStatusData<T>(
  collection: string,
  status: string,
): Promise<T[]> {
  const snapshot = await db
    .collection(collection)
    .where('status', '==', status)
    .get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

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

export async function readAllData<T>(collection: string): Promise<T[]> {
  const snapshot = await db.collection(collection).get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

export async function readDataByField<T>(
  collection: string,
  field: string,
  value: string,
): Promise<T[]> {
  const snapshot = await db
    .collection(collection)
    .where(field, '==', value)
    .get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

export async function readDataByFields<T>(
  collection: string,
  filters: { field: string; value: string }[],
): Promise<T[]> {
  let query: FirebaseFirestore.Query = db.collection(collection);

  for (const { field, value } of filters) {
    query = query.where(field, '==', value);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as T);
}
