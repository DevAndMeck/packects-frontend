// indexedDBService.js
import { openDB } from 'idb';

const dbName = 'employeesDB';
const storeName = 'employees';

// Inicializar la base de datos
const openDatabase = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: '_id' });
      }
    },
  });
};

// Obtener todos los empleados de IndexedDB
export const fetchEmployees = async () => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const employees = await store.getAll();
  await tx.done; // Asegúrate de que la transacción se complete
  return employees;
};

// Guardar un nuevo empleado en IndexedDB
export const saveEmployee = async (newEmployee) => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.put(newEmployee);
  await tx.done; // Asegúrate de que la transacción se complete
};

// Eliminar un empleado de IndexedDB
export const deleteEmployee = async (id) => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.delete(id);
  await tx.done; // Asegúrate de que la transacción se complete
};
