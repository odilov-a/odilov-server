const Admin = require("../models/Admin");

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.json(admins);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const newAdmin = new Admin({
      username: req.body.username,
      password: req.body.password,
    });
    const savedAdmin = await newAdmin.save();
    return res.json(savedAdmin);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json(updatedAdmin);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};
