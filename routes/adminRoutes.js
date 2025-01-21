const express = require("express");
const authController = require("../Controllers/userAuthController");

const router = express.Router();

router.post("/register", authController.registerUser); // Role: Admin
router.get("/login", authController.loginUser);
router.post("/email-otp", authController.generateAndSendPin);
router.post("/resend-pin", authController.resendPin);
router.post("/verify-email", authController.verifyPin);
router.post("/forget-password", authController.sendPasswordResetPin);
router.post("/resend-otp", authController.resendPasswordResetPin);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
