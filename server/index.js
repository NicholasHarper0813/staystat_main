const dotenv = require("dotenv");
// dotenv.config({ path: "prod.env" });
dotenv.config({ path: "kamehameha.env" });
console.log("ENV : ", process.env.NODE_ENV);

const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/dbConnection");
const PORT = process.env.PORT || 5000;
const checkAuth = require("./middlewares/authMiddleware");
const {
  startBookingCronJob,
  startHotelCronJob,
  startUserCronJob,
  startSequenceCronJob,
} = require("./worker/worker");

startBookingCronJob();
startHotelCronJob();
startUserCronJob();
startSequenceCronJob();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes import
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingsRoutes");
const fileRoutes = require("./routes/fileRoutes");
const leadRoutes = require("./routes/leadRoutes");
const workRoutes = require("./routes/workRoutes");
const dataRoutes = require("./routes/dataRoutes");
const smsRoutes = require("./utils/twilo/smsRoutes");

app.use("/", dataRoutes);
app.use("/", authRoutes);
app.use(checkAuth);
app.use("/", userRoutes);
app.use("/", hotelRoutes);
app.use("/", bookingRoutes);
app.use("/", fileRoutes);
app.use("/", leadRoutes);
app.use("/", workRoutes);
app.use("/", smsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

(async () =>
  await connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is live on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.log("Error: ", err);
      throw new Error(err);
    }))();
