const {querySelectionWithNoTime,querySelectionWithTime,querySelectionWithoutText,} = require("./service");

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
      if (v === null ||v === "" ||(typeof v === "object" && (v.parentResourceId === "" || isEmpty(v))))
      return false;
      return true;
    });
    return Object.fromEntries(p);
  };
  

exports.processQuery=async function(req,res){

    const query = createQuery(req.body.query);
    const { txt, startTimestamp, endTimestamp } = req.body;
    let data = null;
    
    if (startTimestamp === "" && endTimestamp === "") {
        data = await querySelectionWithNoTime(query, txt);
    } else if (txt !== "") {
        data = await querySelectionWithTime(query,txt,startTimestamp,endTimestamp);
    } else {
        data = await querySelectionWithoutText(startTimestamp, endTimestamp);
    }
    return res.send(data);

}

exports.insert=async function(req,res){
    const LogDigester = database.collection("LogDigester");
    j = await LogDigester.insertOne(req.body);
    return res.send(200);
}