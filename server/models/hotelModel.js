const mongoose = require("mongoose");
const Sequence = require("./sequenceModel");

const hotelSchema = new mongoose.Schema(
  {
    serialNumber: { type: String },
    hotelName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerContact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    GSTNumber: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
    },
    tradeLicense: {
      type: String,
      required: true,
    },
    roomCategories: {
      type: [String],
      default: [],
    },
    bank: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    otherDocuments: {
      type: String,
    },
    documentId: {
      type: String,
    },
    frontOfficeContact: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

hotelSchema.pre("save", function (next) {
  let doc = this;
  Sequence.findByIdAndUpdate(
    "hotel",
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

const Hotel = mongoose.model("hotel", hotelSchema);

module.exports = { Hotel };
