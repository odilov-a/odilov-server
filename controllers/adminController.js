const Admin = require("../models/Admin");
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.json(admins);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json(admin);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const validateAdminInput = (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({ message: "Both username and password are required fields" });
  }
  return null;
};

exports.createAdmin = async (req, res) => {
  try {
    const validationError = validateAdminInput(req, res);
    if (validationError) return validationError;
    const newAdmin = new Admin({
      ...req.body,
    });
    const savedAdmin = await newAdmin.save();
    return res.json(savedAdmin);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const validationError = validateAdminInput(req, res);
    if (validationError) return validationError;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json(updatedAdmin);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
};