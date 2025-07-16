const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const fetch = require("node-fetch");
require("dotenv").config();

const paypalRoutes = require("./paypal");
const notificationRoutes = require("./notifications");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/paypal", paypalRoutes);
app.use("/notifications", notificationRoutes);  // <-- fix here

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 🟡 CRON JOB: ping every 14 minutes to prevent Render from pausing
console.log("⏱️ Setting up cron job...");

cron.schedule("*/10 * * * *", async () => {
  const url = "https://chefu-academy-tmzx.onrender.com/ping";
  console.log("🔁 Pinging /ping to keep server awake...");

  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log("✅ Ping response:", res.status, text);
  } catch (error) {
    console.error("❌ Ping failed:", error.message);
  }
});

console.log("✅ Cron job initialized to run every 10 minutes.");
