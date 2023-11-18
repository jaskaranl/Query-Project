const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.CONNECTION_URL;
const client = new MongoClient(uri);
database = client.db("LogDigester");
const haiku = database.collection("LogDigester");
exports.a = function a() {
  console.log(1);
};
exports.querySelectionWithNoTime = async function (query, txt) {
  //   console.log(txt, query);
  const pipeline = [
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

  data = await haiku.aggregate(pipeline).toArray();
  return data;
};
exports.querySelectionWithTime = async function (
  query,
  txt,
  startTimestamp,
  endTimestamp
) {
  const pipeline = [
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
  data = await haiku.aggregate(pipeline).toArray();
  return data;
};

exports.querySelectionWithoutText = async function (
  startTimestamp,
  endTimestamp
) {
  pipeline = [
    {
      $match: {
        timestamp: { $gte: startTimestamp, $lte: endTimestamp },
      },
    },
  ];
  data = await haiku.aggregate(pipeline).toArray();
  return data;
};
