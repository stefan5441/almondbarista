import "./App.css";
import { useEffect, useState } from "react";
import { addEntry, type Entry, getAllEntries } from "./db";
import { convertTimestampToDate } from "./utils";

function App() {
  const [text, setText] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Entry | undefined>(undefined);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const handleNavBtnClick = (type: "prev" | "next") => {
    const currEntryIndex = currentEntry
      ? entries.findIndex((entry) => entry.id === currentEntry.id)
      : entries.length - 1;

    const index = type === "next" ? currEntryIndex + 1 : currEntryIndex - 1;

    if (index === entries.length - 1) {
      setCurrentEntry(undefined);
      return;
    }

    setCurrentEntry(entries[index]);
  };

  const handleSubmit = async () => {
    await addEntry({ content: text, timestamp: new Date().setHours(0, 0, 0, 0) });

    const updatedEntries = await getAllEntries();
    setEntries(updatedEntries);

    setText("");
  };

  const isNavBtnEnabled = (type: "prev" | "next") => {
    if (entries.length === 0) {
      return false;
    }

    if (currentEntry === undefined) {
      return type === "prev";
    }

    const currEntryIndex = currentEntry
      ? entries.findIndex((entry) => entry.id === currentEntry.id)
      : entries.length - 1;

    if (type === "prev" && currEntryIndex === 0) return false;
    return true;
  };

  const date = convertTimestampToDate(currentEntry ? currentEntry.timestamp : new Date().getTime());

  return (
    <div className="container">
      <div className="box">
        <h1>What's on your mind today?</h1>

        <textarea
          value={currentEntry ? currentEntry.content : text}
          onChange={(e) => setText(e.target.value)}
          className="textbox"
          rows={12}
          disabled={!!currentEntry}
        />

        <div className="footer">
          <button className="btn" disabled={!!currentEntry || text.length === 0} onClick={handleSubmit}>
            Submit
          </button>
          <div>
            <button
              className="btn btn-nav"
              onClick={() => handleNavBtnClick("prev")}
              disabled={!isNavBtnEnabled("prev")}
            >
              -
            </button>
            <span className="noteNumber">{date}</span>
            <button
              className="btn btn-nav"
              onClick={() => handleNavBtnClick("next")}
              disabled={!isNavBtnEnabled("next")}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
