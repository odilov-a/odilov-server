const Vacancy = require("../models/Vacancy");
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

exports.getAllVacancies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalVacancies = await Vacancy.countDocuments();
    const totalPages = Math.ceil(totalVacancies / limit);
    const vacancies = await Vacancy.find().skip(startIndex).limit(limit);
    const paginationInfo = {
      currentPage: page,
      totalPages,
      totalVacancies,
    };
    return res.json({ vacancies, paginationInfo });
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.getVacancyById = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    return res.json(vacancy);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const validateVacancyInput = (req, res) => {
  const { title, description, price } = req.body;
  if (!title || !description || !price) {
    return res.status(400).json({ message: "Title, description, and price are required fields" });
  }
  return null;
};

exports.createVacancy = async (req, res) => {
  try {
    const validationError = validateVacancyInput(req, res);
    if (validationError) return validationError;
    const newVacancy = new Vacancy({
      ...req.body,
    });
    const savedVacancy = await newVacancy.save();
    return res.json(savedVacancy);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updateVacancy = async (req, res) => {
  try {
    const validationError = validateVacancyInput(req, res);
    if (validationError) return validationError;
    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedVacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    return res.json(updatedVacancy);
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.deleteVacancy = async (req, res) => {
  try {
    const deletedVacancy = await Vacancy.findByIdAndDelete(req.params.id);
    if (!deletedVacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    return res.json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
};