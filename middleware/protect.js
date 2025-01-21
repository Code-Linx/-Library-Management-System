const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const User = require("../db/models/user"); // User model
const Author = require("../db/models/author"); // Author model
const AppError = require("../utils/appError");
const jwtSecret = process.env.JWT_SECRET || "your-jwt-secret-key"; // Secret key for JWT

// Define the JWT options for extracting the token from the request header
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

module.exports = (passport) => {
  // Passport strategy for user authentication
  passport.use(
    "User",
    new Strategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findByPk(jwtPayload.id); // Look for user by ID in the payload
        if (!user) {
          return done(new AppError("User not found", 404), false);
        }
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    })
  );

  // Passport strategy for author authentication
  passport.use(
    "Author",
    new Strategy(opts, async (jwtPayload, done) => {
      try {
        const author = await Author.findByPk(jwtPayload.id); // Look for author by ID in the payload
        if (!author) {
          return done(new AppError("Author not found", 404), false);
        }
        done(null, author);
      } catch (err) {
        done(err, false);
      }
    })
  );
};
