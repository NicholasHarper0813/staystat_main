const mongoose = require("mongoose");
const Sequence = require("./sequenceModel");

let Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: {
      type: String,
    },

    loginTime: {
      type: Date,
    },
    logoutTime: {
      type: Date,
    },
    action: {
        type: String,
    }
  },
  { timestamps: true }
);

const Activity = mongoose.model("activity", activitySchema);

module.exports = {
  Activity,
};
