const mongoose = require("mongoose");
const aboutSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  instagram: {
    type: String,
  },
  telegram: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
  github: {
    type: String,
  },
  gmail: {
    type: String,
  },
  photoLink: {
    type: String,
  },
  level: {
    type: String,
  },
  descriptions: {
    type: String,
  },
});
const About = mongoose.model("About", aboutSchema);
module.exports = About;
