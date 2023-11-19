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
  const [checker, setChecker] = useState(true);
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

  const setTime = (e) => {
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
    const response = await fetch("http://localhost:3000/query", option);
    const data = await response.json();
    setData(data);
    if(data.length===0)
    setChecker(false);
    else{
      setChecker(true);
    }
  };

  return (
    <div className="container">
      <h1>Query Interface </h1>
      <input name="fulltext" type="text" onChange={setTextValue} placeholder="Text to Search"/>
      <h1>Filters</h1>
      <input value={values.level} name="level" type="text" onChange={setChange} placeholder="level" />
      <input name="message" type="text" onChange={setChange} placeholder="message" />
      <input name="resourceId" type="text" onChange={setChange} placeholder="resourceId"/>
      <input name="StartTimeStamp" type="text" onChange={setTime} placeholder="StartTimeStamp" />
      <input name="EndTimeStamp" type="text" onChange={setTime} placeholder="EndTimeStamp" />
      <input name="traceId" type="text" onChange={setChange} placeholder="traceId" />
      <input name="spanId" type="text" onChange={setChange}  placeholder="spanId" />
      <input name="commit" type="text" onChange={setChange} placeholder="commit"/>
      <input name="metadata:parentResourceId" type="text" onChange={setChange} placeholder="parentResourceId"/>

      <button onClick={submit}>Submit</button>
      {checker==false&&<h1>no value found</h1>}     
      {data.length > 0 &&
        data.map((e) => {
          return (
            <div className="outputbox">
              <h2>level-{e.level}</h2>
              <h4>message-{e.message}</h4>
              <h4>spanId-{e.spanId}</h4>
              <h4>traceId-{e.traceId}</h4>
              <h4>commit-{e.commit}</h4>
              <h4>resourceId-{e.resourceId}</h4>
              <h4>parentResourceId-{e.metadata.parentResourceId}</h4>
            </div>
          );
        })}
       
    </div>
  );
}

export default MainPage;
