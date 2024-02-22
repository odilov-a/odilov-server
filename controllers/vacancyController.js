const Vacancy = require("../models/Vacancy");

exports.getAllVacancies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalVacancies = await Vacancy.countDocuments();
    const totalPages = Math.ceil(totalVacancies / limit);
    const vacancies = await Vacancy.find().skip(startIndex).limit(limit);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalVacancies: totalVacancies,
    };
    return res.json({ vacancies, paginationInfo });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createVacancy = async (req, res) => {
  try {
    const newVacancy = new Vacancy({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
    });
    const savedVacancy = await newVacancy.save();
    return res.json(savedVacancy);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateVacancy = async (req, res) => {
  try {
    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
      },
      { new: true }
    );
    if (!updatedVacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    return res.json(updatedVacancy);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};
