import "./App.css";
import { Footer } from "./Footer";
import { type Entry } from "../../db";
import { useEffect, useState } from "react";
import { fetchAndSetCurrentEntry } from "./utils";
import { Textbox } from "../../components/Textbox";

function App() {
  const [text, setText] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Entry | undefined>(undefined);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    fetchAndSetCurrentEntry(setEntries, setCurrentEntry);
  }, []);

  return (
    <div className="container">
      <div className="box">
        <h1>What's on your mind today?</h1>

        <Textbox
          value={currentEntry ? currentEntry.content : text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          disabled={!!currentEntry}
        />

        <Footer
          currentEntry={currentEntry}
          entries={entries}
          setCurrentEntry={setCurrentEntry}
          setEntries={setEntries}
          setText={setText}
          text={text}
          setError={setError}
          setSuccess={setSuccess}
        />

        <div className="info-container">
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
