import React, { useState } from "react";

function MainPage() {
  const initalValue = {
    level: "",
    message: "",
    resourceId: "",
    timestamp: "",
    traceId: "",
    spanId: "",
    commit: "",
    metadata: {},
  };
  const [values, setValues] = useState(initalValue);
  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [startTimestamp, setStartTimestamp] = useState("");
  const [endTimestamp, setEndTimestamp] = useState("");

  const parentResourceId = (name, value, m) => {
    let x = {};
    x.parentResourceId = value;
    return x;
  };

  const setChange = (e) => {
    let { name, value } = e.target;
    let seperator = name.search(":");
    if (seperator !== -1) {
      const obj = parentResourceId(name, value, seperator);
      name = name.slice(0, seperator);
      value = obj;
    }

    setValues({ ...values, [name]: value });
  };

  const setTextValue = (e) => {
    const { name, value } = e.target;
    setText(value);
  };

  const c = (e) => {
    const { name, value } = e.target;
    name === "StartTimeStamp"
      ? setStartTimestamp(value)
      : setEndTimestamp(value);
  };

  const submit = async (e) => {
    const option = {
      method: "POST",
      body: JSON.stringify({
        query: values,
        txt: text,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
      }),
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch("http://localhost:80/query", option);
    const data = await response.json();
    console.log(data);
    setData(data);
  };

  return (
    <div className="container">
      <h1>Query Interface </h1>
      <input
        name="fulltext"
        type="text"
        onChange={setTextValue}
        placeholder="Text to Search"
      />
      <h1>Filters</h1>
      <input
        value={values.level}
        name="level"
        type="text"
        onChange={setChange}
        placeholder="level"
      />

      <input
        name="message"
        type="text"
        onChange={setChange}
        placeholder="message"
      />
      <input
        name="resourceId"
        type="text"
        onChange={setChange}
        placeholder="resourceId"
      />

      <input
        name="StartTimeStamp"
        type="text"
        onChange={c}
        placeholder="StartTimeStamp"
      />
      <input
        name="EndTimeStamp"
        type="text"
        onChange={c}
        placeholder="EndTimeStamp"
      />

      <input
        name="traceId"
        type="text"
        onChange={setChange}
        placeholder="traceId"
      />
      <input
        name="spanId"
        type="text"
        onChange={setChange}
        placeholder="spanId"
      />
      <input
        name="commit"
        type="text"
        onChange={setChange}
        placeholder="commit"
      />
      <input
        name="metadata:parentResourceId"
        type="text"
        onChange={setChange}
        placeholder="parentResourceId"
      />

      <button onClick={submit}>Submit</button>

      {data.length > 0 &&
        data.map((e) => {
          return (
            <div>
              <h1>{e.level}</h1>
              <h3>{e.message}</h3>
            </div>
          );
        })}
    </div>
  );
}

export default MainPage;
