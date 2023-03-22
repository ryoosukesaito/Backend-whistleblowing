require('dotenv').config()
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, () => console.log("Connected to MONGO"));

