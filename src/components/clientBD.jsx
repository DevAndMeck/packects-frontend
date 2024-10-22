// indexedDBService.js
import { openDB } from 'idb';

const dbName = 'ClientDB';
const storeName = 'clients';

// Inicializar la base de datos
const openDatabase = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Cargar clientes desde IndexedDB
export const loadClients = async () => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const clients = await store.getAll();
  await tx.done; // Asegúrate de que la transacción se complete
  return clients;
};

// Agregar cliente a IndexedDB
export const addClient = async (client) => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const id = await store.add({ ...client, products: [] });
  await tx.done; // Asegúrate de que la transacción se complete
  return id;
};

// Editar cliente en IndexedDB
export const saveEditedClient = async (client) => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.put(client);
  await tx.done; // Asegúrate de que la transacción se complete
};

// Eliminar cliente de IndexedDB
export const deleteClient = async (id) => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.delete(id);
  await tx.done; // Asegúrate de que la transacción se complete
};
