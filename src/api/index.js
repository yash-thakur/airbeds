import _ from "lodash";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.text({ limit: "50mb" }));

app.get("/api/getdata", async (req, res) => {
  try {
    const db = app.locals.database;
    db.collection("races").find({}).toArray((err, documents) => {
      if (err) throw err;
      res.send(documents);
    });
  } catch (err) {
    console.log("Try catch err:", err);
  }
});
export default app;
