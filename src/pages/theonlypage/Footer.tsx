import "./Footer.css";
import { Button } from "../../components/Button";
import { convertTimestampToDate } from "../../utils";
import type { Dispatch, SetStateAction } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { addEntry, getAllEntries, type Entry } from "../../db";
import { fetchAndSetCurrentEntry, handleDownloadData, handleUploadData } from "./utils";
import { faChevronLeft, faChevronRight, faDownload, faPaperPlane, faUpload } from "@fortawesome/free-solid-svg-icons";

type Props = {
  currentEntry: Entry | undefined;
  setCurrentEntry: Dispatch<SetStateAction<Entry | undefined>>;
  entries: Entry[];
  setEntries: Dispatch<SetStateAction<Entry[]>>;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
  setSuccess: Dispatch<SetStateAction<string>>;
};

export const Footer = ({
  currentEntry,
  setCurrentEntry,
  entries,
  setEntries,
  text,
  setText,
  setError,
  setSuccess,
}: Props) => {
  const showButtonLabels = useMediaQuery("(min-width: 680px)");

  const handleNavBtnClick = (type: "prev" | "next") => {
    setError("");
    setSuccess("");

    const currEntryIndex = currentEntry ? entries.findIndex((entry) => entry.id === currentEntry.id) : entries.length;

    const index = type === "next" ? currEntryIndex + 1 : currEntryIndex - 1;

    if (index === entries.length) {
      setCurrentEntry(undefined);
      return;
    }

    setCurrentEntry(entries[index]);
  };

  const handleSubmit = async () => {
    try {
      await addEntry({ content: text, timestamp: new Date().setHours(0, 0, 0, 0) });

      const updatedEntries = await getAllEntries();
      setEntries(updatedEntries);
      setCurrentEntry(updatedEntries[updatedEntries.length - 1]);

      setText("");
      setSuccess("Entry saved successfully!");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save entry. Please try again.");
      setSuccess("");
      setTimeout(() => setError(""), 3000);
    }
  };

  const isNavBtnEnabled = (type: "prev" | "next") => {
    if (entries.length === 0) return false;

    if (type === "prev") {
      if (currentEntry === undefined) return true;
      const currEntryIndex = entries.findIndex((entry) => entry.id === currentEntry.id);
      return currEntryIndex !== 0;
    }

    if (type === "next") {
      return currentEntry !== undefined;
    }
  };

  const date = convertTimestampToDate(currentEntry ? currentEntry.timestamp : new Date().getTime());

  return (
    <div className="footer">
      <div className="footer-btns">
        <Button
          label={showButtonLabels ? "submit" : undefined}
          icon={faPaperPlane}
          disabled={!!currentEntry || text.length === 0}
          onClick={handleSubmit}
        />
        <Button
          label={showButtonLabels ? "upload data" : undefined}
          icon={faUpload}
          onFileSelect={async (file) => {
            const uploaded = await handleUploadData(file);
            if (!uploaded) {
              setError("Failed to upload data, please try again or contact the developer");
              setSuccess("");
              setTimeout(() => setError(""), 3000);
            } else {
              await fetchAndSetCurrentEntry(setEntries, setCurrentEntry);
              setSuccess("Successfully uploaded data");
              setText("");
              setError("");
              setTimeout(() => setSuccess(""), 3000);
            }
          }}
        />
        <Button
          label={showButtonLabels ? "download data" : undefined}
          icon={faDownload}
          onClick={() => {
            try {
              handleDownloadData();
              setSuccess("Data downloaded successfully!");
              setError("");
              setTimeout(() => setSuccess(""), 3000);
            } catch {
              setError("Failed to download data. Please try again.");
              setSuccess("");
              setTimeout(() => setError(""), 3000);
            }
          }}
        />
      </div>
      <div className="date-navigation">
        <Button icon={faChevronLeft} onClick={() => handleNavBtnClick("prev")} disabled={!isNavBtnEnabled("prev")} />
        <span className="note-number">{date}</span>
        <Button icon={faChevronRight} onClick={() => handleNavBtnClick("next")} disabled={!isNavBtnEnabled("next")} />
      </div>
    </div>
  );
};
