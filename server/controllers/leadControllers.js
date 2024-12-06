const { Booking } = require("../models/bookingModel");
const { Hotel } = require("../models/hotelModel");
const { User } = require("../models/userModel");
const { Leads } = require("../models/leadModel");




const createLead = async (req, res) => {
  try {
    console.log("Create Lead ===>");
    const {
      guestName,
      checkInDate,
      checkOutDate,
      numberOfPerson,
      numberOfRooms,
      contactNumber,
      area,
      budget,
      specialRequirements,
      status,
    } = req.body;

    const leadCount = await Leads.countDocuments();
    const newLead = {
      guestName,
      checkInDate,
      checkOutDate,
      numberOfPerson,
      numberOfRooms,
      contactNumber,
      area,
      budget,
      specialRequirements,
      status,
      createdBy: req.user._id,
      serialNumber: leadCount + 1,
    };

    const savedLead = await Leads.create(newLead);

    let populatedLeadObject = await Leads.findById(savedLead._id).populate({
      path: "createdBy",
      model: User,
      select: "name email username ",
    });

    if (!savedLead) {
      res.status(201).json({ message: "Lead not created", lead: {} });
      return;
    }
    console.log("savedLead ===>", populatedLeadObject);
    res.status(200).json({
      message: "Lead Created Successfully",
      lead: populatedLeadObject,
    });
  } catch (error) {
    console.error("create Lead error ===> ", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while creating the lead",
    });
  }
};

const getLeads = async (req, res) => {
  const currentDateTime = new Date();


  // async function updateSerialNumbers() {
  //   try {
  //     const users = await Leads.find().sort({ createdAt: 1 }); // Sort by creation date in ascending order

  //     // Update serial numbers
  //     for (let i = 0; i < users.length; i++) {
  //       const user = users[i];
  //       user.serialNumber = i + 1;
  //       await user.save();
  //     }

  //     console.log('Serial numbers updated successfully.');
  //   } catch (error) {
  //     console.error('Error updating serial numbers:', error);
  //   }
  // }
  // await updateSerialNumbers();

  // Some logic to get the user
  try {
    console.log("Get Leads ===>");
    let { page, limit, sortBy, sortOrder, location, addedByMe } = req.query;
    page = parseInt(page) ?? 1;
    limit = parseInt(limit) ?? 10;

    let skipIndex = (page - 1) * limit;
    const leads = await Leads.find({
      isCancelled: false,
      checkOutDate: { $gte: currentDateTime },
    })
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit)
      .populate([
        { path: "createdBy", model: User, select: "name email username" },
        { path: "approvedBy", model: User, select: "name email username" },
      ]);

    let leadsCount = await Leads.countDocuments({ isCancelled: false });

    if (!leads) {
      res.status(200).json({
        error: "No leads found",
        leads: [],
        leadsCount: leadsCount ?? 0,
      });
      return;
    } else {
      res.status(200).json({ leads, leadsCount: leadsCount ?? 0 });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const updateLead = async (req, res) => {
  const {
    id,
    guestName,
    checkInDate,
    checkOutDate,
    numberOfPerson,
    numberOfRooms,
    contactNumber,
    area,
    budget,
    specialRequirements,
  } = req.body;
  try {
    console.log("update lead controller===>");
    const updatedLead = await Leads.findByIdAndUpdate(
      id,
      {
        guestName,
        checkInDate,
        checkOutDate,
        numberOfPerson,
        numberOfRooms,
        contactNumber,
        area,
        budget,
        specialRequirements,
      },
      { new: true } // This option returns the updated document after the update is applied
    );

    if (!updatedLead) {
      return res.status(201).json({ error: "Leads not found" });
    }

    let populatedLeadObject = await Leads.findById(updatedLead._id).populate([
      { path: "createdBy", model: User, select: "name email username" },
      { path: "approvedBy", model: User, select: "name email username" },
    ]);


    res.status(200).json({
      message: "Leads updated successfully",
      lead: populatedLeadObject,
    });
  } catch (error) {
    console.log("leads controller update error ===>", error);
    res.status(201).json({ error: error.message });
  }
};

const confirmLead = async (req, res) => {
  console.log("Confirm Lead ===>");
  let { leadId } = req.body;
  try {
    const updatedLead = await Leads.findByIdAndUpdate(
      leadId,
      { status: "CONFIRMED", approvedBy: req.user._id },
      { new: true }
    ).populate([
      { path: "createdBy", model: User, select: "name email username" },
      { path: "approvedBy", model: User, select: "name email username" },
    ]);

    // Now 'updatedLead' will contain the populated 'createdBy' and 'approvedBy' fields

    if (!updatedLead) {
      res.status(200).json({
        error: "No leads found",
        leads: [],
      });
      return;
    } else {
      res.status(200).json({ lead: updatedLead, message: "Lead Confirmed" });
      return;
    }
  } catch (error) {
    console.log("Lead Confirm error ===>: ", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const getLeadsBySearch = async (req, res) => {
  const currentDateTime = new Date();

  const { query } = req.query;
  console.log("[get leads by search controller: ===>]");
  try {
    const regex = new RegExp(escapeRegex(query), "gi");
    // Fetch user IDs that match the regex pattern
    const matchingUserIds = await User.find({
      $or: [{ name: regex }, { username: regex }],
    }).distinct("_id");

    const leads = await Leads.find({
      isCancelled: false,
      checkOutDate: { $gte: currentDateTime },
    })
      .or([
        { guestName: regex },
        { contactNumber: regex },
        { area: regex },
        { budget: regex },
        { specialRequirements: regex },
        { status: regex },
        {
          $or: [
            { createdBy: { $in: matchingUserIds } },
            { approvedBy: { $in: matchingUserIds } },
          ],
        },
      ])
      .populate({
        path: "approvedBy",
        model: User,
        select: "name email username",
      })
      .populate({
        path: "createdBy",
        model: User,
        select: "name email username",
      });

    if (leads.length > 0) {
      res.status(200).json({ leads, message: "leads fetched successfully" });
    } else {
      res
        .status(200)
        .json({ leads, message: "No result found for this search" });
    }
  } catch (error) {
    console.log("Get leads by search error ===>: ", error);
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  confirmLead,
  getLeadsBySearch,
};
