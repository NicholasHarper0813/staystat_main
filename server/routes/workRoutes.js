const express = require("express");
const router = express.Router();
const workController = require("../controllers/wrokController");

router.post("/work/create-work", workController.createWork);
router.post("/work/update-work", workController.updateWork);
router.post("/work/delete-work", workController.deleteWork);
router.post("/work/update-status", workController.updateWorkStatus);
router.get("/work/get-all-works", workController.getAllWorks);
router.get("/work/get-all-works/search", workController.getWorksBySearch);

module.exports = router;
