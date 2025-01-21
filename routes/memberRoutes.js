const express = require("express");
const authController = require("../Controllers/userAuthController");

const router = express.Router();

/* // Registration routes with dynamic role assignment
router.post("/admin-register", registerUser); // Role: Admin
router.post("/librarian-register", registerUser); // Role: Librarian */
router.post("/member-register", authController.registerUser); // Role: Member

module.exports = router;
