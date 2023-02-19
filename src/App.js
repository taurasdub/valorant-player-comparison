import "./App.css";
import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [data, setData] = useState(null);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedTag, setSubmittedTag] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedName(name);
    setSubmittedTag(tag);
    fetch(`https://api.henrikdev.xyz/valorant/v1/mmr-history/eu/${name}/${tag}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No data found");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setData(null);
        setError("No data found");
      });
  };

  let result = "";

  if (data && data.data) {
    let AMCount = 0;
    let PMCount = 0;

    data.data.forEach((item) => {
      const suffix = item.date.slice(-2);

      if (suffix === "AM") {
        AMCount++;
      } else if (suffix === "PM") {
        PMCount++;
      }
    });

    result = AMCount > PMCount ? "a night owl" : "a day playa";
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Tag:
          <input
            type="text"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <div>{error}</div>}
      {data && (
        <div>
          <p>
            {submittedName}#{submittedTag} is {result}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
