const mongoose = require('mongoose')
const { Schema, model } = mongoose

const tokenSchema = new Schema({
    userId : { type: Schema.Types.ObjectId, required: true, ref: "User" },
    token : { type: String, required: true },
    createdAt : { type: Date, required: true, default: () => Date.now(), expires: 900 }
})

const Token = model ('Token', tokenSchema)
module.exports = Token