const { Schema, model } = require("mongoose");

const mySchema = new Schema({
  code: {
    type: "string",
    required: true,
    unique: true,
  },
  expire: {
    type: "number",
    required: true,
    default: Date.now() + 300000, // Expire after 5 minutes
  },
});

module.exports = model("2fa", mySchema);
