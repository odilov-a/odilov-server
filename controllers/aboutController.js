const About = require("../models/About");
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

exports.getAllAbouts = async (req, res) => {
  try {
    const abouts = await About.find();
    return res.json(abouts);
  } catch (error) {
    return handleServerError(res, error);
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
    return handleServerError(res, error);
  }
};

const validateAboutInput = (req, res) => {
  const { phoneNumber, address, instagram , telegram, linkedIn, github, gmail, photoLink, level, descriptions } = req.body;
  if (!(phoneNumber && address && instagram && telegram && linkedIn && github && gmail && photoLink && lavel &&descriptions)) {
    return res.status(400).json({ message: "All inputs are required fields" });
  }
  return null;
};

exports.createAbout = async (req, res) => {
  try {
    const validationError = validateAboutInput(req, res);
    if (validationError) return validationError;
    const newAbout = new About({
      ...req.body,
    });
    const savedAbout = await newAbout.save();
    return res.json(savedAbout);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const validationError = validateAboutInput(req, res);
    if (validationError) return validationError;
    const updatedAbout = await About.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedAbout) {
      return res.status(404).json({ message: "About not found" });
    }
    return res.json(updatedAbout);
  } catch (error) {
    return handleServerError(res, error);
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
    return handleServerError(res, error);
  }
};