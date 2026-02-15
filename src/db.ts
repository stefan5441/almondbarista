import Dexie, { type Table } from "dexie";

export type Entry = {
  id?: number;
  content: string;
  timestamp: number;
};

export class AlmondBaristaDB extends Dexie {
  entries!: Table<Entry, number>;
  constructor() {
    super("coffeeShopPOS");

    this.version(1).stores({
      entries: "++id, timestamp",
    });
  }
}

export const db = new AlmondBaristaDB();

export const addEntry = async (entry: Omit<Entry, "id">) => {
  await db.entries.put(entry);
};

export const addEntries = async (entries: Entry[]) => {
  await db.entries.bulkAdd(entries);
};

export const getAllEntries = async (): Promise<Entry[]> => {
  return await db.entries.toArray();
};
