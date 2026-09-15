/**
 * backupStorage.js
 * High-capacity asynchronous storage manager for TaskArts nightly automated snapshots.
 *
 * Uses browser IndexedDB instead of localStorage to prevent QuotaExceededError (5MB limit).
 * Automatically cleans up any legacy monolithic snapshots from localStorage to free up space.
 */

const DB_NAME = 'rajinkerja_backup_db';
const DB_VERSION = 1;
const STORE_NAME = 'snapshots';
const KEY_LATEST = 'latest_snapshot';

/**
 * Open or initialize the IndexedDB instance
 * @returns {Promise<IDBDatabase>}
 */
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not available in this browser context'));
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open IndexedDB'));
      };

      request.onblocked = () => {
        console.warn('IndexedDB opening blocked by another tab');
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Clean up legacy monolithic snapshot from localStorage to release quota back to application
 */
export function cleanLegacyLocalStorageSnapshot() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('ft_nightly_backup_snapshot');
    }
  } catch (e) {
    // Ignore any quota or security errors
  }
}

/**
 * Save full state snapshot to IndexedDB safely without hitting localStorage 5MB quota
 * @param {Object} fullState
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function saveNightlySnapshot(fullState) {
  // 1. Immediately liberate localStorage quota by purging old monolithic key
  cleanLegacyLocalStorageSnapshot();

  const today = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString('id-ID');

  // 2. Persist to IndexedDB (virtually unlimited capacity, multi-MB/GB safe)
  try {
    const db = await openIndexedDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putRequest = store.put(fullState, KEY_LATEST);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);

      tx.onerror = () => reject(tx.error);
    });

    // 3. Update light metadata in localStorage safely
    try {
      window.localStorage.setItem('ft_last_nightly_backup_date', today);
      window.localStorage.setItem('ft_last_nightly_backup_time', time);
    } catch (metaErr) {
      console.warn('Could not update backup metadata timestamps:', metaErr);
    }

    return { success: true, date: today, time };
  } catch (idbErr) {
    console.warn('IndexedDB backup snapshot failed:', idbErr);
    // Even if IndexedDB fails, we guarantee no uncaught crash
    try {
      window.localStorage.setItem('ft_last_nightly_backup_date', today);
      window.localStorage.setItem('ft_last_nightly_backup_time', time);
    } catch (e) {}
    return { success: false, error: idbErr };
  }
}

/**
 * Retrieve the latest nightly snapshot from IndexedDB (or fallback to legacy localStorage)
 * @returns {Promise<Object|null>}
 */
export async function getNightlySnapshot() {
  // 1. Try IndexedDB
  try {
    const db = await openIndexedDB();
    const snapshot = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(KEY_LATEST);

      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject(getRequest.error);
    });

    if (snapshot) {
      return snapshot;
    }
  } catch (err) {
    console.warn('Could not read snapshot from IndexedDB:', err);
  }

  // 2. Fallback to legacy localStorage if available
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('ft_nightly_backup_snapshot');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migrate to IndexedDB and purge legacy
        saveNightlySnapshot(parsed).catch(() => {});
        return parsed;
      }
    }
  } catch (e) {}

  return null;
}
