const mongoose = require("mongoose");
const Sequence = require("./sequenceModel");

let Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    serialNumber: { type: String },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: String,
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      enum: ["ADMIN", "SUBADMIN", "USER"],
      default: "USER",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
    hotel: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let doc = this;
  Sequence.findByIdAndUpdate(
    "user",
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

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
};
