const bcrypt = require("bcryptjs");
const { User } = require("../models/userModel");
const { Activity } = require("../models/activityModel");
const generateJWT = require("../config/generateToken");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { sendEmail } = require("../controllers/userController");

const JWT_SECRET_PASSWORD_RESET = process.env.JWT_SECRET_PASSWORD_RESET;
const FRONTEND_URL = process.env.FRONTEND_URL;

const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    const jwt = generateJWT(newUser._id);
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser, jwt: jwt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password, ip } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      res.status(201).json({ message: "User not found" });
      return;
    } else if (user.isActive === false) {
      res
        .status(201)
        .json({ message: "Your account has been deactivated by admin" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(200).json({ message: "Invalid credentials" });
      return;
    }

    const jwt = generateJWT(user._id);

    const newActivity = await Activity.create({
      user: user._id,
      ipAddress: ip,
      loginTime: new Date(),
      action: "LOGIN",
    });

    res.status(200).json({ message: "Login successful", user: user, jwt: jwt });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
const forgotPasswordGenerateLink = async (req, res) => {
  let { email } = req.body;
  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      res.status(201).json({ error: "User not found" });
      return;
    }

    //generate the reset link
    const secret = JWT_SECRET_PASSWORD_RESET + user.password;
    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "10m" });
    const link = `${FRONTEND_URL}/reset-password?id=${user._id}&token=${token}`;

    // Send email to the user
    const subject = "STAY STATS ADMIN PANEL - Account Reset Link";

    const linkExpiration = 10; // in minutes
    const linkExpiryMessage = `Please note that this link will expire in ${linkExpiration} minutes.`;

    const bodyTemplateText = `Hello ${
      user?.name || user?.username
    },\n\nYour password reset request has been considered.\n\nKindly visit this link to reset your password: ${link}\n\n${linkExpiryMessage}\n\nRegards,\nSTATYSTATS ADMIN PANEL`;

    const bodyTemplateHtml = `<p>Hello ${
      user?.name || user?.username
    },</p><p>Your password reset request has been considered.</p><p>Kindly visit this link to reset your password: <a href="${link}">Reset Password</a>.</p><p>${linkExpiryMessage}</p><p>Regards,</p><p>STAY STATS ADMIN PANEL</p>`;

    let emailResponse = await sendEmail(
      email,
      subject,
      bodyTemplateText,
      bodyTemplateHtml
    );

    if (emailResponse?.accepted.length > 0) {
      res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
      return;
    } else {
      res
        .status(201)
        .json({ error: "Something went wrong. Please try again later." });
      return;
    }
  } catch (error) {
    console.log("forgotPasswordGenerateLink error ===> ", error);
    res.status(500).json({ error: error.message });
  }
};

const resetPasswordLinkValidation = async (req, res) => {
  let { id, token } = req.body;
  try {
    let user = await User.findById(id);

    if (!user) {
      res.status(201).json({ error: "No such user exists" });
      return;
    }

    const secret = JWT_SECRET_PASSWORD_RESET + user.password;

    const payload = jwt.verify(token, secret);
    res.status(200).json({ message: "Link verified successfully" });
    return;
  } catch (error) {
    console.log("resetPasswordLinkValidation error ===> ", error);
    res.status(201).json({ error: "The reset password link has expired" });
    return;
  }
};

const resetPassword = async (req, res) => {
  let { id, token, password } = req.body;
  try {
    let user = await User.findById(id);

    if (!user) {
      res.status(201).json({ error: "No such user exists" });
      return;
    }

    const secret = JWT_SECRET_PASSWORD_RESET + user.password;

    const payload = jwt.verify(token, secret);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const updatedUser = await User.findByIdAndUpdate(new ObjectId(payload.id), {
      password: hashedPassword,
    });
    if (updatedUser) {
      res.status(200).json({ message: "Password reset successful" });
      return;
    } else {
      res
        .status(201)
        .json({ error: "Something went wrong. Please try again later." });
      return;
    }
  } catch (error) {
    console.log("resetPassword error ===> ", error);
    res.status(500).json({ error: error.message });
    return;
  }
};

const logout = async (req, res) => {
  let { id, ip, action } = req.body;

  console.log("logout req.body ===> ", req.body);
  try {
    let newActivity = await Activity.create({
      user: id,
      ipAddress: ip,
      logoutTime: new Date(),
      action: action,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("logout error ===> ", error);
    res.status(500).json({ error: error.message });
    return;
  }
};

const getAllActivities = async (req, res) => {
  console.log("getAllActivities req.body ===> ");
  try {
    let activities = await Activity.find({})
      .populate({
        path: "user",
        select: "name username role",
        model: User,
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ activities: activities, message: "Success" });
  } catch (error) {
    console.log("getAllActivities error ===> ", error);
    res.status(500).json({ error: error.message });
    return;
  }
};

module.exports = {
  signup,
  login,
  forgotPasswordGenerateLink,
  resetPasswordLinkValidation,
  resetPassword,
  logout,
  getAllActivities,
};
