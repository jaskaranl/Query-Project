const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.CONNECTION_URL;
const client = new MongoClient(uri);
database = client.db("LogDigester");
const LogDigester = database.collection("LogDigester");

exports.querySelectionWithNoTime = async function (query, txt) {
  
  const pipeline = [
    {
      $search: {
        index: "new",
        text: {
          query: '{$search:{text:{query:"' + txt + '"}}}',
          path: {
            wildcard: "*",},},},},
    {
      $match: query,
    },
  ];

  data = await LogDigester.aggregate(pipeline).toArray();
  return data;
};

exports.querySelectionWithTime = async function ( query, txt,startTimestamp,endTimestamp) {
  timestampObject={}
  if(startTimestamp!=="")
  {
    timestampObject.$gte=startTimestamp
  }
  if(endTimestamp!=="")
  {
    timestampObject.$lte=endTimestamp;
  }
  const pipeline = [
    {
      $search: {
        index: "new",
        text: {
          query: '{$search:{text:{query:"' + txt + '"}}}',
          path: {
            wildcard: "*",},},},},
    {
      $match: {
        $and: [
          query,
          { timestamp: timestampObject },
        ],},
    },
  ];
  data = await LogDigester.aggregate(pipeline).toArray();
  return data;
};

exports.querySelectionWithoutText = async function (startTimestamp,endTimestamp) {
  timestampObject={}
  if(startTimestamp!==""){
    timestampObject.$gte=startTimestamp
  }
  if(endTimestamp!==""){
    timestampObject.$lte=endTimestamp;
  }
  pipeline = [
    {
      $match: {
        timestamp: timestampObject,
      },
    },
  ];
  data = await LogDigester.aggregate(pipeline).toArray();
  return data;
};
