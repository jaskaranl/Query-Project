const express = require("express");

const {processQuery,insert}=require("./Controller")
const path = require("path");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/",(req, res) =>insert(req,res));
app.post("/query",(req,res)=>processQuery(req,res));

app.listen(8080, (err) => {
  err
    ? console.log("Failed to listen on PORT 8080")
    : console.log("Load Balancer Server " + "listening on PORT 8080");
});

module.exports = app;
