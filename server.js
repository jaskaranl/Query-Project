const express = require("express");
const {
  querySelectionWithNoTime,
  querySelectionWithTime,
  querySelectionWithoutText,
} = require("./service");
const path = require("path");
const cors = require("cors");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.CONNECTION_URL;
const client = new MongoClient(uri);
database = client.db("LogDigester");

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}
const createQuery = (body) => {
  obj = Object.entries(body);
  p = obj.filter(([k, v]) => {
    if (
      v === null ||
      v === "" ||
      (typeof v === "object" && (v.parentResourceId === "" || isEmpty(v)))
    )
      return false;
    return true;
  });
  return Object.fromEntries(p);
};

app
  .get("/", (req, res) => {
    return res.send("homepage");
  })
  .post("/insert", async (req, res) => {
    const haiku = database.collection("LogDigester");
    j = await haiku.insertOne(req.body);
    return res.send(200);
  });

app.post("/query", async (req, res) => {
  const haiku = database.collection("LogDigester");
  const query = createQuery(req.body.query);
  const { txt, startTimestamp, endTimestamp } = req.body;
  //console.log(req.body);
  let data = null;
  if (startTimestamp === "" && endTimestamp === "") {
    data = await querySelectionWithNoTime(query, txt);
  } else if (txt !== "") {
    data = await querySelectionWithTime(
      query,
      txt,
      startTimestamp,
      endTimestamp
    );
  } else {
    data = await querySelectionWithoutText(startTimestamp, endTimestamp);
  }
  // console.log(data);
  //data = await haiku.aggregate(pipeline).toArray();
  return res.send(data);
  client.close();
});

app.listen(8080, (err) => {
  err
    ? console.log("Failed to listen on PORT 8080")
    : console.log("Load Balancer Server " + "listening on PORT 8080");
});

module.exports = app;
