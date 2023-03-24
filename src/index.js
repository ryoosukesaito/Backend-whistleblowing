require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

require("./services/mongoose-playground");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());

app.use("/", require("./routes/index"));

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
