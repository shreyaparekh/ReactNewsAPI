const connectToMongo = require("./db");
const express = require("express");
connectToMongo();
const app = express();
const port = 3001;
app.use(express.json());//middleware after applying this console value is disply that are i nauth.js
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
//Avalible Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Express app listening on port at http://localhost:${port}`);
});

