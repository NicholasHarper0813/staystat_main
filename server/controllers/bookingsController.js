const { Booking } = require("../models/bookingModel");
const { Hotel } = require("../models/hotelModel");
const { User } = require("../models/userModel");
const mongoose = require("mongoose");
const moment = require("moment");
const Sequence = require("../models/sequenceModel");
const ObjectId = mongoose.Types.ObjectId;

const getBooking = async (req, res) => 
{
  const { bookingId } = req.body;
  try
  {
    const booking = await Booking.findById(bookingId);
    if (!booking) 
    {
      res.status(200).json({ error: "No booking found", booking: {} });
    } 
    else 
    {
      res.status(200).json({ booking });
    }
  } 
  catch (error)
  {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const saveCustomBookingData = async (req, res) => {
  let notFoundUser = null;
  try 
  {
    const jsonData = req.body;
    if (!jsonData || !Array.isArray(jsonData)) 
    {
      return res.status(400).json({ message: "Invalid JSON data" });
    }

    if (jsonData.length > 140)
    {
      return res.status(400).json({
        message: "You can upload a maximum of 140 bookings at a time",
      });
    }

    const lastBooking = await Booking.findOne().sort({ createdAt: -1 });
    let serialNumber = lastBooking ? parseInt(lastBooking.serialNumber) + 1 : 1;
    const resultData = [];

    for (const bookingData of jsonData) 
    {
      const hotel = await Hotel.findOne({
        hotelName: bookingData["Hotel Name"],
      });

      if (!hotel)
      {
        console.error(`Hotel not found for name: ${bookingData["Hotel Name"]}`);
        continue;
      }
      const user = await User.findOne({ name: bookingData["Booked By"] });

      if (!user) 
      {
        notFoundUser = bookingData["Booked By"];
        throw new Error(`User not found for name: ${bookingData["Booked By"]}`);
      }

      const { _id: hotelId } = hotel;
      const bookingAmount = parseFloat(bookingData["Booking Amount"]);
      const advanceAmount = parseFloat(bookingData["Advance Amount"]);
      const dueAmount = bookingAmount - advanceAmount;
      const formattedBooking = 
      {
        hotel: hotelId,
        serialNumber: serialNumber.toString(),
        guestName: bookingData["Guest Name"],
        guestEmail: bookingData["Guest Email"],
        checkInDate: moment(
          bookingData["Check-In Date"],
          "DD-MM-YYYY",
        ).toDate(),
        checkOutDate: moment(
          bookingData["Check-Out Date"],
          "DD-MM-YYYY",
        ).toDate(),
        roomCategory: bookingData["Room Category"],
        numberOfRooms: parseInt(bookingData["Number of Rooms"]),
        numberOfPersons: parseInt(bookingData["Number of Person"]),
        advanceDate: moment(bookingData["Advance Date"], "DD-MM-YYYY").toDate(),
        bookingSource: bookingData["Booking Source"],
        bookingBy: bookingData["Booked By"],
        plan: bookingData["Plan"],
        bookingAmount: bookingAmount,
        advanceAmount: advanceAmount,
        dueAmount: dueAmount,
        contactNumber: bookingData["Guest Contact"],
        remarks: bookingData["Remarks"] || "",
        addedBy: user._id,
        status: bookingData["Booking Status"] || "CONFIRMED",
        accountType: bookingData["Account Type"] || "",
      };

      serialNumber += 1;
      resultData.push(formattedBooking);
    }

    if (resultData.length !== jsonData.length) 
    {
      throw new Error(
        "Bookings were not saved because some unknown data found in your data",
      );
    }

    for (const booking of resultData) 
    {
      await Booking.create(booking);
    }

    res.status(200).json({ message: "All Data uploaded successfully" });
  } 
  catch (error)
  {
    console.error(error);
    res.status(500).json({
      message: notFoundUser
        ? `User ${notFoundUser} not found`
        : `Internal server error`,
    });
  }
};

const getAllBookings = async (req, res) => {
  try 
  {
    let
    {
      page,
      limit,
      addedBy,
      filterBy,
      bookingSource,
      serialNumber,
      guestName,
      hotelName,
      status,
    } = req.query;
    let { startDate, endDate } = req.body;
    let skipIndex = (query_page - 1) * query_limit;
    let bookings;
    let filter = {};
    let query_page = parseInt(page) ?? 1;
    let query_limit = parseInt(limit) ?? 10;
    
    console.log(startDate + "startDate");
    if (req.user.role === "SUBADMIN")
    {
      filter.addedBy = req.user._id;
    }

    if (filterBy === "stay") 
    {
      let selectedDate = new Date(startDate);
      selectedDate.setHours(6, 30, 0, 0);
      
      filter.checkInDate = { $lte: selectedDate };
      filter.checkOutDate = { $gt: selectedDate };
      console.log(selectedDate + "selectedDate");
      
      if ( hotelName !== "undefined" && hotelName !== "null" && hotelName !== "" && hotelName !== "--select--") 
      {
        filter.hotel = hotelName;
      }
    }

    if (filterBy && startDate && endDate) 
    {
      if (filterBy === "checkInDate") 
      {
        filter.checkInDate = 
        {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } 
      else if (filterBy === "checkOutDate") 
      {
        filter.checkOutDate = 
        {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } 
      else if (filterBy === "createdAt") 
      {
        filter.createdAt = 
        {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } 
      else if (filterBy === "updatedAt") 
      {
        filter.updatedAt = 
        {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } 
      else if (filterBy === "status") 
      {
        status = "CANCELLED";
        filter.updatedAt = 
        {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }
    
    if (bookingSource !== "undefined" && bookingSource !== "null" && bookingSource !== "" && bookingSource !== "--select--") 
    {
      filter.bookingSource = bookingSource;
    }
    
    if ( serialNumber !== "undefined" && serialNumber !== "null" && serialNumber !== "") 
    {
      filter.serialNumber = serialNumber;
    }
    
    if (guestName !== "undefined" && guestName !== "null" && guestName !== "")
    {
      filter.guestName = guestName.toUpperCase();
    }
    
    if ( hotelName !== "undefined" && hotelName !== "null" && hotelName !== "" && hotelName !== "--select--") 
    {
      filter.hotel = hotelName;
    }
    
    if ( addedBy !== "undefined" && addedBy !== "null" && addedBy !== "" && addedBy !== "--select--") 
    {
      filter.addedBy = addedBy;
    }
    
    if ( status !== "undefined" && status !== "null" && status !== "" && status !== "--select--") 
    {
      filter.status = status;
    }
    
    let bookingsForCalculation;
    
    if (page && limit) 
    {
      bookingsForCalculation = await Booking.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .populate({ path: "hotel", model: Hotel })
        .populate({ path: "addedBy", model: User });

      bookings = await Booking.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .skip(skipIndex)
        .limit(query_limit)
        .populate({ path: "hotel", model: Hotel })
        .populate({ path: "addedBy", model: User });
    } 
    else 
    {
      bookings = await Booking.find(filter)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .populate({ path: "hotel", model: Hotel });
    }

    let bookingsCount = await Booking.countDocuments(filter);
    if (!bookings || bookings.length === 0) 
    {
      res.status(200).json({
        message: "No bookings found",
        bookings: [],
        bookingsCount: bookingsCount ?? 0,
      });
    } 
    else 
    {
      let totalBookingAmt = 0;
      let totalAdvanceAmt = 0;
      let totalDueAmt = 0;

      bookingsForCalculation &&
        bookingsForCalculation.forEach((booking) => {
          if (booking.status !== "CANCELLED") {
            totalBookingAmt += booking.bookingAmount;
            totalAdvanceAmt += booking.advanceAmount;
            totalDueAmt += booking.dueAmount;
          }
        });

      res.status(200).json({
        bookings,
        bookingsCount: bookingsCount ?? 0,
        totalBookingAmt,
        totalAdvanceAmt,
        totalDueAmt,
        bookingsForCalculation,
      });
    }
  } 
  catch (error) 
  {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

function escapeRegex(text) 
{
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const getAllBookingsBySearch = async (req, res) => {
  const { query } = req.query;
  console.log("[get all bookings by search controller: =>]");
  console.log(req.query);
  try
  {
    let filter = {};

    if (req.user.role === "SUBADMIN")
    {
      filter.addedBy = req.user._id;
    }

    const regex = new RegExp(escapeRegex(query), "gi");
    const bookings = await Booking.find(filter)
      .or([
        { guestName: regex },
        { contactNumber: regex },
        {
          hotel: {
            $in: await Hotel.find({
              $or: [
                { hotelName: regex },
                { location: regex },
              ],
            }).distinct("_id"),
          },
        },
      ])
      .populate({
        path: "hotel",
        model: Hotel,
      });

    if (bookings.length > 0) {
      console.log(bookings.length);
      res
        .status(200)
        .json({ bookings, message: "Bookings fetched successfully" });
    } 
    else 
    {
      console.log("No result found for this search");
      res
        .status(200)
        .json({ bookings, message: "No result found for this search" });
    }
  } 
  catch (error)
  {
    console.log(error);
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
};

const createBooking = async (req, res) => {
  const
  {
    hotel,
    guestName,
    checkInDate,
    checkOutDate,
    roomCategory,
    numberOfRooms,
    numberOfPersons,
    bookingAmount,
    advanceAmount,
    dueAmount,
    advanceDate,
    bookingSource,
    bookingBy,
    plan,
    contactNumber,
    accountType,
    remarks,
    guestEmail,
  } = req.body;
  try 
  {
    const bookingsCount = await Booking.countDocuments();
    const newBooking = await Booking.create({
      hotel,
      guestName,
      checkInDate,
      checkOutDate,
      roomCategory,
      numberOfRooms,
      numberOfPersons,
      bookingAmount,
      advanceAmount,
      dueAmount,
      advanceDate,
      bookingSource,
      bookingBy,
      plan,
      contactNumber,
      accountType,
      remarks,
      guestEmail,
      addedBy: req.user._id,
      serialNumber: bookingsCount + 1,
    });
    if (!newBooking) 
    {
      res.status(201).json({ message: "Booking not created", booking: {} });
      return;
    }

    const populatedBooking = await Booking.findById(newBooking._id).populate({
      path: "hotel",
      model: Hotel,
    });

    res.status(200).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } 
  catch (error) 
  {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try 
  {
    const 
    {
      id,
      guestName,
      checkInDate,
      checkOutDate,
      roomCategory,
      numberOfRooms,
      numberOfPersons,
      bookingAmount,
      advanceAmount,
      dueAmount,
      advanceDate,
      bookingSource,
      bookingBy,
      accountType,
      plan,
      contactNumber,
      remarks,
      guestEmail,
      status,
    } = req.body;
    console.log("[update bookings controller]", roomCategory);
    console.log(req.body);

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        guestName,
        checkInDate,
        checkOutDate,
        roomCategory,
        numberOfRooms,
        numberOfPersons,
        bookingAmount,
        advanceAmount,
        dueAmount,
        advanceDate,
        bookingSource,
        bookingBy,
        accountType,
        plan,
        contactNumber,
        remarks,
        guestEmail,
        status,
      },
      { new: true },
    );

    if (!updatedBooking)
    {
      return res.status(201).json({ error: "Booking not found" });
    }

    const populatedBooking = await Booking.findById(updatedBooking._id,).populate({
      path: "hotel",
      model: Hotel,
    });

    res.status(200).json({
      message: "Booking updated successfully",
      user: populatedBooking,
    });
  } 
  catch (error) 
  {
    console.log("[booking controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId, status } = req.body;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status,
      },
      { new: true },
    );

    if (!updatedBooking)
    {
      return res.status(201).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } 
  catch (error)
  {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const undoCancelBooking = async (req, res) => {
  const { bookingId, status } = req.body;
  try 
  {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status,
      },
      { new: true },
    );

    if (!updatedBooking) 
    {
      return res.status(201).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: "Cancellation Reversed Successfully",
      booking: updatedBooking,
    });
  } 
  catch (error) 
  {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const downloadExcel = async (req, res) => {};

module.exports = {
  getBooking,
  getAllBookings,
  getAllBookingsBySearch,
  createBooking,
  updateBooking,
  cancelBooking,
  undoCancelBooking,
  downloadExcel,
  saveCustomBookingData,
};
