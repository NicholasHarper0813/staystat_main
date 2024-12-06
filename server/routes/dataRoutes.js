const router = require("express").Router();
const dataController = require("../controllers/dataController");

router.get("/data/users", dataController.getUsers);
router.get("/data/hotels", dataController.getHotels);
router.get("/data/bookings", dataController.getBookings);

module.exports = router;
