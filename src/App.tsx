import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState<string>("");

  return (
    <div className="container">
      <div className="box">
        <h1>What's on your mind today?</h1>

        <textarea value={text} onChange={(e) => setText(e.target.value)} className="textbox" rows={12} />

        <div className="footer">
          <button className="btn">Submit</button>
          <div>
            <button className="btn">-</button>
            <span className="noteNumber">3</span>
            <button className="btn">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
