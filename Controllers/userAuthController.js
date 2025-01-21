const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const pinHelper = require("../utils/generatePin");
const Email = require("../utils/email");

// Function to register a new user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Dynamically assign role based on the route
  let role;
  if (req.originalUrl.includes("/admin")) {
    role = "Admin";
  } else if (req.originalUrl.includes("/librarian")) {
    role = "Librarian";
  } else {
    role = "Member"; // Default role if no specific route is matched
  }

  // 1. Validate the input (Basic validation)
  if (!name || !email || !password) {
    return next(new AppError("Please provide all required fields", 400));
  }

  // 2. Check if the email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  // 3. Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. Create the user in the database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role, // Dynamically assigned role
  });

  // 5. Create JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // 6. Send the response back
  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Function to login the user
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validate the input
  if (!email || !password) {
    return next(new AppError("Please provide both email and password", 400));
  }

  // 2. Find the user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3. Compare the password with the hashed password in the database
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 4. Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // 5. Send the response back
  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

exports.generateAndSendPin = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new PIN and set expiration to 2 minutes
    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Hash the PIN
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Save the hashed PIN and expiration to the user record
    user.verificationPin = hashedPin;
    user.pinExpires = expires;
    await user.save();

    // Send the email
    const emailClient = new Email({
      email: user.email,
      name: user.name,
      pin, // Sending the plain PIN in the email, not the hashed one
    });
    await emailClient.sendVerificationPin();
    res.status(200).json({ message: "Verification PIN sent successfully." });
  } catch (err) {
    console.log(err.message);
    //next(err);
  }
};

exports.resendPin = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    // Clear the previous PIN and expiration time
    user.verificationPin = null;
    user.pinExpires = null;

    // Generate a new PIN and set expiration to 2 minutes
    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Hash the new PIN
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Save the new hashed PIN and expiration to the user record
    user.verificationPin = hashedPin;
    user.pinExpires = expires;
    await user.save();

    // Send the new PIN email
    const emailClient = new Email({
      email: user.email,
      name: user.name,
      pin, // Sending the plain PIN in the email, not the hashed one
    });
    await emailClient.sendVerificationPin();

    res
      .status(200)
      .json({ message: "New verification PIN sent successfully." });
  } catch (err) {
    next(err);
  }
};

exports.verifyPin = async (req, res, next) => {
  try {
    const { email, pin } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    // Check if the PIN is expired
    if (user.pinExpires < new Date()) {
      return next(new AppError("PIN has expired.", 400));
    }

    // Compare the provided PIN with the hashed PIN
    const isMatch = await bcrypt.compare(pin, user.verificationPin);
    if (!isMatch) {
      return next(new AppError("Invalid PIN.", 400));
    }

    // PIN is valid
    res.status(200).json({ message: "PIN verified successfully." });
  } catch (err) {
    next(err);
  }
};

exports.sendPasswordResetPin = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Enter your email", 403));
    }

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    // Generate a new PIN and set expiration to 2 minutes
    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Hash the new PIN
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Save the new hashed PIN and expiration to the user record
    user.passwordResetPin = hashedPin;
    user.passwordResetPinpinExpires = expires;
    await user.save();

    // Send the reset PIN email
    const emailClient = new Email({
      email: user.email,
      name: user.name,
      pin, // Sending the plain PIN in the email
    });
    await emailClient.sendPasswordResetPin();

    res.status(200).json({ message: "Password reset PIN sent successfully." });
  } catch (err) {
    console.log(err.message);
    //next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, pin, newPassword } = req.body;
    if (!email || !pin || !newPassword) {
      return next(new AppError("Provide All Details", 403));
    }

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    // Compare entered PIN with the hashed one stored in the database
    const isPinValid = await bcrypt.compare(pin, user.passwordResetPin);
    if (!isPinValid) {
      return next(new AppError("Invalid PIN. Please try again.", 400));
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the password in the user record
    user.password = hashedPassword;
    user.passwordResetPin = null; // Clear the reset PIN after verification
    user.pinExpires = null; // Clear the expiration time
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    next(err);
  }
};

exports.resendPasswordResetPin = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Enter your email", 403));
    }

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    // Clear the previous PIN and expiration time
    user.passwordResetPin = null;
    user.pinExpires = null;

    // Generate a new PIN and set expiration to 2 minutes
    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Hash the new PIN
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Save the new hashed PIN and expiration to the user record
    user.passwordResetPin = hashedPin;
    user.passwordResetPinpinExpires = expires;
    await user.save();

    // Send the reset PIN email
    const emailClient = new Email({
      email: user.email,
      name: user.name,
      pin, // Sending the plain PIN in the email
    });
    await emailClient.sendPasswordResetPin();

    res
      .status(200)
      .json({ message: "New password reset PIN sent successfully." });
  } catch (err) {
    next(err);
  }
};

// Protect middleware for user authentication and authorization
exports.protect = catchAsync(async (req, res, next) => {
  // Use Passport to authenticate the JWT
  passport.authenticate("user", { session: false }, async (err, user, info) => {
    if (err || !user) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // Attach the authenticated user to the request object
    req.user = user;

    // 1) Check if the user still exists in the database
    const currentUser = await User.findOne({ where: { id: req.user.id } });
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 404)
      );
    }

    // 2) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(req.user.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // Attach the user to res.locals to access user data in views (optional)
    res.locals.user = currentUser;

    // Proceed to the next middleware or route handler
    next();
  })(req, res, next);
});
