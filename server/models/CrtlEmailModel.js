const mongoose = require("mongoose");

const CrtlEmailSchema = new mongoose.Schema({
  subject: String,
  sender: String,
  seen: Boolean,
});

// Create a Mongoose model based on the schema
const CrtlEmailModel = mongoose.model("crtl_emails", CrtlEmailSchema);
module.exports = CrtlEmailModel;
