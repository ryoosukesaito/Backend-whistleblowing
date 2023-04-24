const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
    expires: 900,
  },
});

const TokenAdmin = model("TokenAdmin", tokenSchema);
module.exports = TokenAdmin;
