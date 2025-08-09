// --- Step 1: Open (or create) the database ---
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TextStorage", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("contents")) {
        db.createObjectStore("contents", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Step 2: Save or update text ---
export async function saveContent(id, text) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("contents", "readwrite");
    const store = tx.objectStore("contents");
    store.put({ id, text, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// --- Step 3: Get saved content ---
export async function getContent(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("contents", "readonly");
    const store = tx.objectStore("contents");
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Step 4: Auto-save at interval ---
export function AutoSave(id, getContentFn) {
  // getContentFn should be a function that returns the latest text to save
  setInterval(() => {
    const textValue = getContentFn();
    if (textValue && textValue.trim()) {
      saveContent(id, textValue).then(() => {
        console.log("Auto-saved:", id);
      });
    }
  }, 2000); // every 5 seconds
}
