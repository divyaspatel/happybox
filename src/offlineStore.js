import { openDB } from 'idb';

const DB_NAME = 'happy-box-offline';
const STORE_NAME = 'pending-notes';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, {
      keyPath: 'id',
      autoIncrement: true,
    });
  },
});

export const savePendingNote = async (noteData) => {
  const db = await dbPromise;
  return db.add(STORE_NAME, {
    ...noteData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
};

export const getPendingNotes = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const deletePendingNote = async (id) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
};

export const clearPendingNotes = async () => {
  const db = await dbPromise;
  return db.clear(STORE_NAME);
};
