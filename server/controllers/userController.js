const { User } = require("../models/userModel");
const { Hotel } = require("../models/hotelModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const FRONTEND_URL = process.env.FRONTEND_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (
  receiverEmail,
  subject,
  bodyTemplateText,
  bodyTemplateHtml
) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "freeproject87@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "STAY STATS ADMIN PANEL <freeproject87@gmail.com>",
      to: receiverEmail,
      subject: subject,
      text: bodyTemplateText,
      html: bodyTemplateHtml,
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.log("Error in sendEmail ===> ", error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("getAllUsers");
    const users = await User.find();
    if (!users) {
      res.status(200).json({ error: "No users found", users: [] });
      return;
    } else {
      res.status(200).json({ users });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    console.log("getUser");
    const user = await User.findById(req.body.id).populate({
      path: "hotel",
      model: Hotel,
    });
    if (!user) {
      res.status(200).json({ error: "No user found", user: {} });
      return;
    } else {
      res.status(200).json({ user });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getUsers = async (req, res) => {
  // Some logic to get the user
  try {
    console.log("getUsers");

    //scripts to change db
    // async function updateSerialNumbers() {
    //   try {
    //     const users = await User.find().sort({ createdAt: 1 }); // Sort by creation date in ascending order

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

    let { page, limit, sortBy, sortOrder, location, addedByMe } = req.query;
    let query_page = parseInt(page) ?? 1;
    let query_limit = parseInt(limit) ?? 10;

    let skipIndex = (query_page - 1) * query_limit;
    let users;
    if (page && limit) {
      users = await User.find({ role: "SUBADMIN" })
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .skip(skipIndex)
        .limit(query_limit)
        .populate({ path: "hotel", model: Hotel });
    } else {
      users = await User.find({ role: "SUBADMIN" })
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
        .populate({ path: "hotel", model: Hotel });
    }

    let usersCount = await User.countDocuments({ role: "SUBADMIN" });

    if (!users) {
      res.status(200).json({
        error: "No users found",
        users: [],
        usersCount: usersCount ?? 0,
      });
      return;
    } else {
      res.status(200).json({ users, usersCount: usersCount ?? 0 });
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

const getUsersBySearch = async (req, res) => {
  const { query } = req.query;
  console.log("[get users by search controller: =>]");
  console.log(req.query);
  try {
    const regex = new RegExp(escapeRegex(query), "gi");

    const users = await User.find()
      .or([
        { name: regex }, // Search for forms with name matching the provided regex
        { email: regex }, // Search for forms with email matching the provided regex
        { username: regex }, // Search for forms with username matching the provided regex
      ])
      // .and([formsQuery])    // Additional conditions specified in formsQuery
      // .limit(5)
      .populate({ path: "hotel", model: Hotel });

    if (users.length > 0) {
      res.status(200).json({ users, message: "Users fetched successfully" });
    } else {
      res
        .status(200)
        .json({ users, message: "No result found for this search" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
};

const createUser = async (req, res) => {
  let { name, username, password, email, phoneNumber, role, hotel } = req.body;

  try {
    const usersCount = await User.countDocuments();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    hotelIds = hotel.map((hotelId) => new ObjectId(hotelId));
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      phoneNumber,
      email,
      role,
      hotel: hotelIds,
      addedBy: req.user._id,
      serialNumber: usersCount + 1,
    });
    const populatedUser = await User.findById(newUser._id).populate({
      path: "hotel",
      model: Hotel,
    });

    // Send email to the user
    const subject = "STAY STATS ADMIN PANEL - Account Created";

    const bodyTemplateText = `Hello ${name},\n\nYour account has been created successfully.\n\nYour username is: ${username}\nYour password is: ${password}\n\nPlease login to your account at: ${
      FRONTEND_URL + "/login"
    }\n\nRegards,\nSTATYSTATS ADMIN PANEL`;

    const bodyTemplateHtml = `<p>Hello ${name},</p><p>Your account has been created successfully.</p><p>Your username is: ${username}</p><p>Your password is: ${password}</p><p>Please login to your account <a href="${FRONTEND_URL}/login">here</a>.</p><p>Regards,</p><p>STAY STATS ADMIN PANEL</p>`;

    let emailResponse = await sendEmail(
      email,
      subject,
      bodyTemplateText,
      bodyTemplateHtml
    );

    res
      .status(200)
      .json({ message: "User created successfully", user: populatedUser });
  } catch (error) {
    console.log("[user controller error:]", error);
    if (error.code === 11000) {
      res.status(201).json({ error: "Username already exists" });
      return;
    }
    res.status(201).json({ error: error.message });
  }
};

const activateDeactiveUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(200).json({ error: "No user found" });
      return;
    } else {
      if (user.isActive) {
        user.isActive = false;
      } else {
        user.isActive = true;
      }
      await user.save();
      res.status(200).json({ message: "User updated successfully" });
      return;
    }
  } catch (error) {
    console.log("[user controller activation error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id, phoneNumber, hotel, username, name, email, password } = req.body;
  try {
    console.log("[updateuser controller]");
    if (password === null || password === undefined || password === "") {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { phoneNumber, hotel, name, username, email },
        { new: true } // This option returns the updated document after the update is applied
      );

      const populatedUser = await User.findById(updatedUser._id).populate({
        path: "hotel",
        model: Hotel,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const subject = "STAY STATS ADMIN PANEL - Account Updated";

      const updatedBodyTemplateText = `Hello ${name},\n\nYour account information has been updated successfully.\n\nHere are your updated details:\n\nName: ${name}\nUsername: ${username}\nEmail: ${email}\nPhone Number: ${phoneNumber}\n\nPlease review your updated information. If you have any concerns, please contact admin.\n\nRegards,\nSTATYSTATS ADMIN PANEL`;

      const updatedBodyTemplateHtml = `<p>Hello ${name},</p><p>Your account information has been updated successfully.</p><p>Here are your updated details:</p><ul><li>Name: ${name}</li><li>Username: ${username}</li><li>Email: ${email}</li><li>Phone Number: ${phoneNumber}</li></ul><p>Please review your updated information. If you have any concerns, please contact admin</a>.</p><p>Regards,</p><p>STAY STATS ADMIN PANEL</p>`;

      let emailResponse = await sendEmail(
        email,
        subject,
        updatedBodyTemplateText,
        updatedBodyTemplateHtml
      );

      res
        .status(200)
        .json({ message: "User updated successfully", user: populatedUser });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { phoneNumber, hotel, name, username, email, password: hashedPassword },
        { new: true } // This option returns the updated document after the update is applied
      );

      const populatedUser = await User.findById(updatedUser._id).populate({
        path: "hotel",
        model: Hotel,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      const subject = "STAY STATS ADMIN PANEL - Account Updated";

      const updatedBodyTemplateText = `Hello ${name},\n\nYour account information has been updated successfully.\n\nHere are your updated details:\n\nName: ${name}\nUsername: ${username}\nEmail: ${email}\nPhone Number: ${phoneNumber}\n\nPlease review your updated information. If you have any concerns, please contact admin.\n\nUse this email and password: ${password} to login next time.\n\nRegards,\nSTATYSTATS ADMIN PANEL`;

      const updatedBodyTemplateHtml = `<p>Hello ${name},</p><p>Your account information has been updated successfully.</p><p>Here are your updated details:</p><ul><li>Name: ${name}</li><li>Username: ${username}</li><li>Email: ${email}</li><li>Phone Number: ${phoneNumber}</li></ul><p>Please review your updated information. If you have any concerns, please contact admin</a>.</p><p>Use this email and password: <strong>${password}</strong> to login next time.</p><p>Regards,</p><p>STAY STATS ADMIN PANEL</p>`;

      let emailResponse = await sendEmail(
        email,
        subject,
        updatedBodyTemplateText,
        updatedBodyTemplateHtml
      );

      res
        .status(200)
        .json({ message: "User updated successfully", user: populatedUser });
    }
  } catch (error) {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(200).json({ message: "No user found" });
      return;
    } else {
      res.status(200).json({ message: "User deleted successfully" });
      return;
    }

    //TODO: delete all the bookings of the user
  } catch (error) {
    console.log("[user controller deletion error:]", error);
    res.status(201).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  getUsers,
  getUsersBySearch,
  createUser,
  updateUser,
  deleteUser,
  sendEmail,
  activateDeactiveUser,
  getAllUsers,
};
