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

  const setChangeInValues = (e) => {
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

  const setTimeValue = (e) => {
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
      <input value={values.level} name="level" type="text" onChange={setChangeInValues} placeholder="level" />
      <input name="message" type="text" onChange={setChangeInValues} placeholder="message" />
      <input name="resourceId" type="text" onChange={setChangeInValues} placeholder="resourceId"/>
      <input name="StartTimeStamp" type="text" onChange={setTimeValue} placeholder="StartTimeStamp" />
      <input name="EndTimeStamp" type="text" onChange={setTimeValue} placeholder="EndTimeStamp" />
      <input name="traceId" type="text" onChange={setChangeInValues} placeholder="traceId" />
      <input name="spanId" type="text" onChange={setChangeInValues}  placeholder="spanId" />
      <input name="commit" type="text" onChange={setChangeInValues} placeholder="commit"/>
      <input name="metadata:parentResourceId" type="text" onChange={setChangeInValues} placeholder="parentResourceId"/>

      <button onClick={submit}>Submit</button>
      {checker===false&&<h1>no value found</h1>}     
      {data.length > 0 &&
        data.map((e) => {
          return (
            <div className="outputbox">
              <h2>Level-{e.level}</h2>
              <h4>Message-{e.message}</h4>
              <h4>SpanId-{e.spanId}</h4>
              <h4>TraceId-{e.traceId}</h4>
              <h4>Commit-{e.commit}</h4>
              <h4>ResourceId-{e.resourceId}</h4>
              <h4>ParentResourceId-{e.metadata.parentResourceId}</h4>
            </div>
          );
        })}
       
    </div>
  );
}

export default MainPage;
