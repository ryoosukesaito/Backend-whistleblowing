const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const ImageSchema = new Schema({
    caption: {
        required: true,
        type: String,
    },
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
});


const Image = model('Image', ImageSchema)
module.exports = Image
