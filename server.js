/* const { Sequelize } = require("sequelize"); */
/* const sequelize = require("./config/database"); */

const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = require("./app");

/* const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
); */

/* (async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
})(); */

/* process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1); // Exit process with failure code
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1); // Exit process with failure code
}); */

// START SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
