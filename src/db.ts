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

    this.on("populate", async () => {
      await this.entries.bulkAdd([
        { content: "Demo entry 1", timestamp: new Date("2025-12-20T09:00:00").getTime() },
        { content: "Demo entry 2", timestamp: new Date("2025-12-21T10:30:00").getTime() },
        { content: "Demo entry 3", timestamp: new Date("2025-12-22T14:15:00").getTime() },
        { content: "Demo entry 4", timestamp: new Date("2025-12-23T16:45:00").getTime() },
        { content: "Demo entry 5", timestamp: new Date("2025-12-24T20:00:00").getTime() },
      ]);
    });
  }
}

export const db = new AlmondBaristaDB();

export const addEntry = async (entry: Omit<Entry, "id">) => {
  await db.entries.put(entry);
};

export const getAllEntries = async (): Promise<Entry[]> => {
  return await db.entries.toArray();
};
