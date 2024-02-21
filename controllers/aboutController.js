const About = require("../models/About");

exports.getAllAbouts = async (req, res) => {
  try {
    const abouts = await About.find();
    return res.json(abouts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAbout = async (req, res) => {
  try {
    const newAbout = new About({
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      instagram: req.body.instagram,
      telegram: req.body.telegram,
      linkedIn: req.body.linkedIn,
      github: req.body.github,
      gmail: req.body.gmail,
      photoLink: req.body.photoLink,
      level: req.body.level,
      descriptions: req.body.descriptions,
    });
    const savedAbout = await newAbout.save();
    return res.json(savedAbout);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const updatedAbout = await About.findByIdAndUpdate(
      req.params.id,
      {
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        instagram: req.body.instagram,
        telegram: req.body.telegram,
        linkedIn: req.body.linkedIn,
        github: req.body.github,
        gmail: req.body.gmail,
        photoLink: req.body.photoLink,
        level: req.body.level,
        descriptions: req.body.descriptions,
      },
      { new: true }
    );
    if (!updatedAbout) {
      return res.status(404).json({ message: "About not found" });
    }
    return res.json(updatedAbout);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAbout = async (req, res) => {
  try {
    const deletedAbout = await About.findByIdAndDelete(req.params.id);
    if (!deletedAbout) {
      return res.status(404).json({ message: "About not found" });
    }
    return res.json({ message: "About deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
