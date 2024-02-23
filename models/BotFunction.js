const mongoose = require("mongoose");
const botFunctionSchema = new mongoose.Schema(
  {
    bookTitle: {
      type: String,
    },
    bookChapter: {
      type: String,
    },
    bookAudio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BotFunction = mongoose.model("BotFunction", botFunctionSchema);
module.exports = BotFunction;