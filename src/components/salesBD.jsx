// salesDB.js
export const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SalesDB', 1);
  
      request.onerror = (event) => {
        reject('Error al abrir la base de datos.');
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('sales', { keyPath: '_id' });
      };
    });
  };
  
  export const getAllSales = (db) => {
    return new Promise((resolve) => {
      const transaction = db.transaction('sales', 'readonly');
      const store = transaction.objectStore('sales');
      const request = store.getAll();
  
      request.onsuccess = () => resolve(request.result);
    });
  };
  
  export const saveSale = (db, sale) => {
    const transaction = db.transaction('sales', 'readwrite');
    const store = transaction.objectStore('sales');
    store.put(sale);
  };
  
  export const deleteSale = (db, saleId) => {
    const transaction = db.transaction('sales', 'readwrite');
    const store = transaction.objectStore('sales');
    store.delete(saleId);
  };
  