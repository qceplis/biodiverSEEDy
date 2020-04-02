const express = require("express");
const bodyparser = require("body-parser");
const db = require("./db/postgres");
require("dotenv").config({ path: "../.env" });

app = express();

app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);

app.use("", require("./routes/routes"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
