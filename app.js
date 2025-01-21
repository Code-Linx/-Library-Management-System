const path = require("path");
const express = require("express");
const morgan = require("morgan");
const { handleError } = require("./middleware/errorController");
const AppError = require("./utils/appError");
const memeberRouter = require("./routes/memberRoutes");
const adminRouter = require("./routes/adminRoutes");
const passport = require("passport");
const passportConfig = require("./middleware/protect");
const app = express();

app.use(express.json());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

//DEVELOPMENT LOGGING
if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}
// Initialize passport
app.use(passport.initialize());

// Call the passport config function to use the strategy
passportConfig(passport);

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/member", memeberRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling function
app.use(handleError);
module.exports = app;
