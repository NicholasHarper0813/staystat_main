// models/workModel.js

const mongoose = require("mongoose");
const Sequence = require("./sequenceModel");
let Schema = mongoose.Schema;

const workSchema = new mongoose.Schema(
  {
    userName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workDetails: {
      type: String,
      required: true,
    },
    finishDeadline: {
      type: Date,
      required: true,
    },
    workConfirm: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED"],
      default: "PENDING",
    },
    serialNumber: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    remarks: {
      type: String,
    },
  },
  { timestamps: true },
);

workSchema.pre("save", function (next) {
  let doc = this;
  Sequence.findByIdAndUpdate(
    "Work",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
    .then(function (count) {
      doc.serialNumber = count.seq;
      next();
    })
    .catch(function (err) {
      console.error("counter error-> : " + err);
      throw err;
    });
});

const Work = mongoose.model("Work", workSchema);

module.exports = {
  Work,
};
