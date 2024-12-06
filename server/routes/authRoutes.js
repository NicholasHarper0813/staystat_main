const router = require("express").Router();
const authController = require("../controllers/authController");

// router.post('/api/signup', authController.signup);
router.post("/api/login", authController.login);
router.post("/api/forgot-password", authController.forgotPasswordGenerateLink);
router.post(
  "/api/reset-password-validation",
  authController.resetPasswordLinkValidation,
);
router.post("/api/reset-password", authController.resetPassword);
router.post("/api/logout", authController.logout);
router.get("/api/get-all-activities", authController.getAllActivities);

module.exports = router;
