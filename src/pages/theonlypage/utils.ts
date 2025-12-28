import { getAllEntries, replaceAllEntries, type Entry } from "../../db";

export const fetchAndSetCurrentEntry = async (
  setEntries: (entries: Entry[]) => void,
  setCurrentEntry: (entry: Entry | undefined) => void
) => {
  const res = await getAllEntries();
  setEntries(res);

  const lastEntry = res[res.length - 1];
  if (!lastEntry) {
    setCurrentEntry(undefined);
    return;
  }

  const lastEntryDate = new Date(lastEntry.timestamp).setHours(0, 0, 0, 0);
  const currDate = new Date().setHours(0, 0, 0, 0);

  setCurrentEntry(lastEntryDate === currDate ? lastEntry : undefined);
};

export const handleUploadData = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text();
    const data: unknown = JSON.parse(text);
    if (!Array.isArray(data)) return false;

    const entries: Entry[] = [];
    for (const item of data) {
      if (typeof item.content !== "string" || typeof item.timestamp !== "number") {
        return false;
      }

      entries.push({
        id: item.id,
        content: item.content,
        timestamp: item.timestamp,
      });
    }

    await replaceAllEntries(entries);
    return true;
  } catch {
    return false;
  }
};

export const handleDownloadData = async () => {
  const entries = await getAllEntries();
  const blob = new Blob([JSON.stringify(entries, null, 2)], {
    type: "application/json",
  });

  const now = new Date();
  const dateString = now.toISOString().split("T")[0];
  const fileName = `almondbarista_${dateString}.json`;

  downloadBlob(blob, fileName);
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};
