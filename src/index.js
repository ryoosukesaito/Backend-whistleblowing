const express = require("express");
const path = require("path");
require("dotenv").config();
const methodOverride = require('method-override');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const crypto = require('crypto');
require('express-async-errors')
const cors = require('cors')


// require('./services/mongoose.service')


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.use(express.json())
app.use(cors())
app.use("/", require("./routes/index"));


const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(process.env.MONGO_URL, () => console.log("Connected to MONGO"));

connect.then(() => {
  console.log('Connected to database: GridApp');
}, (err) => console.log(err));

// create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
      return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
              if (err) {
                  return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {
                  filename: filename,
                  bucketName: 'uploads'
              };
              resolve(fileInfo);
          });
      });
  }
});

const upload = multer({ storage });
const imageRouter = require("./routes/imageRouter")

app.use("/uploadFn", imageRouter(upload));

// catch 404 and forward to error handler
app.use((req,res,next) => {
  const err = new Error("Route not found")
  err.status = 404
  next(err)
})

//catch all middleware/route
app.use((error, req,res,next) => {
  res.status(error.status || 500).json({ error: error.message })
})


app.listen(process.env.PORT || 8080, () => {
  console.log("Server has started...");
});


