const { Hotel } = require("../models/hotelModel");
const { User } = require("../models/userModel");
const { Booking } = require("../models/bookingModel");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "SUBADMIN" }).populate({
      path: "hotel",
      model: Hotel,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("hotel").populate({
      path: "addedBy",
      model: User,
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getHotels,
  getBookings,
};
