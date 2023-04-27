const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Report = require("./Report")
const bcrypt = require('bcryptjs')
const {salt} = require("../config")

const userSchema = new Schema({
    name: {
        type: String,
        // required: true,
    },
    NameforReport:{
        type: Schema.Types.ObjectId,
        ref: 'Report'
    }
    ,
    email: {
        type: String,
        // minlength: 10,
        required: true,
        lowercase: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: Date,
    deleteAt: Date
})

userSchema.pre('save', function(next){
    // console.log(this);
    const user = this
    user.updatedAt = Date.now()
    next()
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    const hash = await bcrypt.hash(this.password, salt)
    //密碼的加密是bcrypt管的，不是JWT
    this.password = hash
    next()
})

const User = model('User', userSchema)
module.exports = User

