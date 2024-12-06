// smsRoutes.js
const express = require("express");
const router = express.Router();
const client = require("./twilio");

router.post("/send-sms", async (req, res) => {
  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).json({ error: 'Both "to" and "body" are required' });
  }

  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!fromNumber) {
    return res
      .status(500)
      .json({ error: "Twilio phone number is not configured" });
  }

  try {
    const message = await client.messages.create({
      body: body,
      from: fromNumber,
      to: to,
    });

    res.json({ success: true, messageId: message.sid });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res
      .status(500)
      .json({ error: "Failed to send SMS", details: error.message });
  }
});

module.exports = router;
