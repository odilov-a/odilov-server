require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const vacancyRoutes = require("./routes/vacancyRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const adminRoutes = require("./routes/adminRoutes");
const createRoutes = require("./routes/createRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const blogRoutes = require("./routes/blogRoutes");
const botBookRoutes = require("./routes/botBookRoutes");
const botFunctionRoutes = require("./routes/botFunctionRoutes");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  session({
    secret: "n1r2u3b87g84bgfy4g483gfy4",
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.use("/", adminRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/abouts", aboutRoutes);
    app.use("/api/admins", createRoutes);
    app.use("/api/vacancies", vacancyRoutes);
    app.use("/api/portfolios", portfolioRoutes);
    app.use("/api/bot-books", botBookRoutes);
    app.use("/api/bot-functions", botFunctionRoutes);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(
        `Server is running on ${process.env.PROTOCOL}://${process.env.SERVER_IP}:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
