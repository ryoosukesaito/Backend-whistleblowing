const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Report = require("./Report")

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    forReportId: {
        type: Schema.Types.ObjectId,
        ref: 'Report' 
    },
    deleteAt: Date
})


const Category = model('Category', CategorySchema)
module.exports = Category

