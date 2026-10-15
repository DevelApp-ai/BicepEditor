/**
 * Minimal typed wrapper over IndexedDB with schema versioning.
 * Used by the browser build for session-persisted storage.
 */
export class BrowserStorage {
  private db: IDBDatabase | null = null;
  private readonly name: string;
  private readonly version: number;

  constructor(name = 'bicep-blockly-editor', version = 1) {
    this.name = name;
    this.version = version;
  }

  async open(stores: string[]): Promise<void> {
    if (this.db) {
      return;
    }
    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB unavailable');
    }
    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version);
      request.onupgradeneeded = () => {
        for (const store of stores) {
          if (!request.result.objectStoreNames.contains(store)) {
            request.result.createObjectStore(store);
          }
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
    });
  }

  async put(store: string, key: string, value: unknown): Promise<void> {
    const db = this.requireDb();
    await this.transaction(db, store, tx => tx.objectStore(store).put(value, key));
  }

  async get<T>(store: string, key: string): Promise<T | null> {
    const db = this.requireDb();
    return this.transaction<T | null>(db, store, tx =>
      this.requestToPromise<T | null>(tx.objectStore(store).get(key), () => null)
    );
  }

  async list<T>(store: string): Promise<T[]> {
    const db = this.requireDb();
    return this.transaction<T[]>(db, store, async tx => {
      const values = await this.requestToPromise<unknown[]>(
        tx.objectStore(store).getAll(),
        () => []
      );
      return values as T[];
    });
  }

  async delete(store: string, key: string): Promise<void> {
    const db = this.requireDb();
    await this.transaction(db, store, tx => tx.objectStore(store).delete(key));
  }

  private requireDb(): IDBDatabase {
    if (!this.db) {
      throw new Error('IndexedDB not opened');
    }
    return this.db;
  }

  private async transaction<T>(
    db: IDBDatabase,
    store: string,
    operation: (tx: IDBTransaction) => IDBRequest | Promise<T>
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      let result: T | null = null;
      tx.oncomplete = () => resolve(result as T);
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
      void Promise.resolve(operation(tx)).then(value => {
        result = value as T;
      });
    });
  }

  private requestToPromise<T>(request: IDBRequest, fallback: () => T): Promise<T> {
    return new Promise<T>(resolve => {
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => resolve(fallback());
    });
  }
}
