const connectToMongo = require("./db");
const express = require("express");
connectToMongo();
const app = express();
const port = 3001;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Express app listening on port at http://localhost:${port}`);
});

