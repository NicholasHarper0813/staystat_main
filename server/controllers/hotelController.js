const { Hotel } = require("../models/hotelModel");
const { User } = require("../models/userModel");

const getHotel = async (req, res) => {
  const { hotelId } = req.body;
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(200).json({ error: "No hotel found", hotel: {} });
      return;
    } else {
      res.status(200).json({ hotel });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllHotels = async (req, res) => {
  try {
    console.log("[getAllHotels] controller: =====>");

    //scripts to change db
    // async function updateSerialNumbers() {
    //   try {
    //     const hotels = await Hotel.find().sort({ createdAt: 1 }); // Sort by creation date in ascending order

    //     // Update serial numbers
    //     for (let i = 0; i < hotels.length; i++) {
    //       const hotel = hotels[i];
    //       hotel.serialNumber = i + 1;
    //       hotel.ifscCode = "DEFAULT NONE";
    //       hotel.accountNumber = "DEFAULT NONE";

    //       await hotel.save();
    //     }

    //     console.log('Serial numbers updated successfully.');
    //   } catch (error) {
    //     console.error('Error updating serial numbers:', error);
    //   }
    // }
    // await updateSerialNumbers();

    // Extract filters from req.query
    let { page, limit, sortBy, sortOrder, location, addedByMe, filterBy } =
      req.query;
    let query_page = parseInt(page) ?? 1;
    let query_limit = parseInt(limit) ?? 10;

    let skipIndex = (query_page - 1) * query_limit;
    let hotels;

    // Build the filter object based on the received query parameters
    const filter = {};
    if (filterBy) {
    }

    if (location) {
      filter.location = location;
    }
    if (addedByMe) {
      filter.addedBy = req.user._id;
    }

    // Build the sort object based on the received query parameters
    const sort = {};

    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Fetch hotels with applied filters and sorting
    if (page && limit) {
      hotels = await Hotel.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .skip(skipIndex)
        .limit(query_limit)
        .populate("addedBy");
    } else {
      hotels = await Hotel.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .populate("addedBy");
    }
    let hotelsCount = await Hotel.countDocuments(filter);

    console.timeEnd("get hotels");

    if (!hotels || hotels.length === 0) {
      res.status(200).json({
        error: "No hotels found",
        hotels: [],
        hotelsCount: hotelsCount ?? 0,
      });
      return;
    } else {
      res.status(200).json({ hotels, hotelsCount: hotelsCount ?? 0 });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const getAllHotelsBySearch = async (req, res) => {
  const { query } = req.query;
  console.log("[get all hotels by search controller: =>]");
  console.log(req.query);
  try {
    const regex = new RegExp(escapeRegex(query), "gi");

    const hotels = await Hotel.find()
      .or([
        { hotelName: regex },
        { location: regex },
        { ownerName: regex },
        { "ownerContact.email": regex },
        { "ownerContact.phone": regex },
        { frontOfficeContact: regex },
      ])
      // .and([formsQuery])    // Additional conditions specified in formsQuery
      // .limit(5)
      .populate({ path: "addedBy", model: User });

    if (hotels.length > 0) {
      res.status(200).json({ hotels, message: "Hotels fetched successfully" });
    } else {
      res
        .status(200)
        .json({ hotels, message: "No result found for this search" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
};

const createHotel = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    res.status(201).json({ error: "You are not authorized to create a hotel" });
    return;
  }
  const hotelsCount = await Hotel.countDocuments();
  const {
    hotelName,
    location,
    ownerName,
    ownerContact,
    GSTNumber,
    panNumber,
    aadharNumber,
    tradeLicense,
    bank,
    otherDocuments,
    documentId,
    frontOfficeContact,
    accountNumber,
    ifscCode,
    roomCategories,
  } = req.body;
  try {
    const newHotel = await Hotel.create({
      hotelName,
      location,
      ownerName,
      ownerContact,
      GSTNumber,
      panNumber,
      aadharNumber,
      tradeLicense,
      bank,
      otherDocuments,
      documentId,
      frontOfficeContact,
      accountNumber,
      ifscCode,
      addedBy: req.user._id,
      serialNumber: hotelsCount + 1,
      roomCategories,
    });
    if (!newHotel) {
      res.status(201).json({ message: "Hotel not created", hotel: {} });
      return;
    }
    await User.updateMany(
      { role: "ADMIN" },
      { $push: { hotel: newHotel._id } }
    );
    res
      .status(200)
      .json({ message: "Hotel created successfully", hotel: newHotel });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

const updateHotelStatus = async (req, res) => {
  const { id } = req.body;
  try {
    console.log("[updateuser controller]");
    const updatedHotel = await Hotel.findById(id);
    if (!updatedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    updatedHotel.isActive = !updatedHotel.isActive;
    await updatedHotel.save();
    res
      .status(200)
      .json({ message: "Hotel updated successfully", hotel: updatedHotel });
  } catch (error) {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const updateHotel = async (req, res) => {
  const {
    id,
    ownerName,
    hotelName,
    location,
    ownerContact,
    bank,
    GSTNumber,
    panNumber,
    aadharNumber,
    tradeLicense,
    otherDocuments,
    documentId,
    frontOfficeContact,
    accountNumber,
    ifscCode,
  } = req.body;
  try {
    console.log("[updateuser controller]");
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        hotelName,
        location,
        ownerName,
        ownerContact,
        bank,
        GSTNumber,
        panNumber,
        aadharNumber,
        tradeLicense,
        otherDocuments,
        documentId,
        frontOfficeContact,
        accountNumber,
        ifscCode,
      },
      { new: true } // This option returns the updated document after the update is applied
    );

    if (!updatedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res
      .status(200)
      .json({ message: "Hotel updated successfully", user: updatedHotel });
  } catch (error) {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.body;
    let hotelAddedBy = await Hotel.findById(id);
    hotelAddedBy = hotelAddedBy.addedBy;
    console.log("hotel added by: ", hotelAddedBy);
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    if (!deletedHotel) {
      res.status(200).json({ error: "No hotel found" });
      return;
    } else {
      let updatedUser = await User.updateMany(
        { role: "ADMIN" },
        {
          $pull: { hotel: id },
        },
        { new: true }
      );
      console.log("updated user: ", updatedUser);
      if (updatedUser) {
        res.status(200).json({ message: "Hotel deleted successfully" });
        return;
      }
    }
  } catch (error) {
    console.log("[hotel controller ]: ", error);
    res.status(201).json({ error: error.message });
  }
};

module.exports = {
  getHotel,
  getAllHotels,
  getAllHotelsBySearch,
  createHotel,
  updateHotel,
  deleteHotel,
  updateHotelStatus,
};
