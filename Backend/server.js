require("dotenv").config();
require("module-alias/register");
const env = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3001;
const express = require("express");
const { sequelize } = require("./models");
const usersRoutes = require("./routes/users");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "FieldRequiredError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "AlreadyTakenError") {
    return res.status(409).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: err.message });
  }

  res.status(500).json({ message: err.message || "Internal Server Error" });
};

(async () => {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Erro:", error);
  }
})();

app.get("/", (req, res) => res.json({ status: "API is running on /api" }));
app.use("/api/users", usersRoutes);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
