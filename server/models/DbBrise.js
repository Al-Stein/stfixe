const mongoose = require("mongoose");

const DBBRISE = new mongoose.Schema();

const DbBriseModel = mongoose.model("dbbrise", DBBRISE);

module.exports = DbBriseModel;
