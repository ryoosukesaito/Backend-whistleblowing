const mongoose = require('mongoose')
const { Schema, model } = mongoose

const adminTokenSchema = new Schema({
    email : { type: String, required: true },
    role : { type: String, required: true },
    token : { type: String, required: true },
    createdAt : { type: Date, required: true, default: () => Date.now(), expires: 900 }
})

const AdminToken = model ('AdminToken', adminTokenSchema)
module.exports = AdminToken