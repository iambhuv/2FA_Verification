const { Schema, model } = require("mongoose");

const mySchema = new Schema({
  username: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  name: {
    type: "string",
    required: true,
    unique: false,
  },
  twofactor: {
    type: "string",
    required: true,
  },
});

module.exports = model("Users", mySchema);
