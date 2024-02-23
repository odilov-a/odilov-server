const mongoose = require("mongoose");
const botBookSchema = new mongoose.Schema(
  {
    bookTitle: {
      type: String,
    },
    bookDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BotBook = mongoose.model("BotBook", botBookSchema);
module.exports = BotBook;