const express = require("express");
const ConnectDB = require("./Utility/ConnectDB");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
app.use(express.static("static"));
app.use(express.json());
// CONNECT TO DATABASE
ConnectDB();

app.use("/api", require("./routes/api"));

app.listen(port, () => {
  console.log(`[SERVER] Started: http://localhost:${port}`);
});
