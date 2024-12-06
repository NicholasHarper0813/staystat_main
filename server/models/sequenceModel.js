const mongoose = require("mongoose");

const SequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Sequence = mongoose.model("Sequence", SequenceSchema);

module.exports = Sequence;
