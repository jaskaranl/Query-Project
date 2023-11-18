const express = require("express");

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

  let pipeline = null;
  if (startTimestamp === "" || endTimestamp === "") {
    pipeline = [
      {
        $search: {
          index: "new",
          text: {
            query: '{$search:{text:{query:"' + txt + '"}}}',
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $match: query,
      },
    ];
  } else if (txt !== "") {
    pipeline = [
      {
        $search: {
          index: "new",
          text: {
            query: '{$search:{text:{query:"' + txt + '"}}}',
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $match: {
          $and: [
            query,
            { timestamp: { $gte: startTimestamp, $lte: endTimestamp } },
          ],
        },
      },
    ];
  } else {
    pipeline = [
      {
        $match: {
          timestamp: { $gte: startTimestamp, $lte: endTimestamp },
        },
      },
    ];
  }

  data = await haiku.aggregate(pipeline).toArray();
  return res.send(data);
  client.close();
});
