const mongoose = require("mongoose");
const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    github: {
      type: String,
    },
    photoLink: {
      type: String,
    },
    secondPhotoLink: {
      type: String,
      required: false,
    },
    link: {
      type: String,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
    },
    tools: {
      type: String,
    },
    client: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const Portfolio = mongoose.model("Portfolio", portfolioSchema);
module.exports = Portfolio;
