const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const fetch = require("node-fetch");
require("dotenv").config();

const paypalRoutes = require("./paypal");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/paypal", paypalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 🟡 CRON JOB: ping every 14 minutes to prevent Render from pausing
console.log("⏱️ Setting up cron job...");

cron.schedule("*/10 * * * *", async () => {
  const url = "https://chefu-academy-tmzx.onrender.com";
  console.log("🔁 Pinging to keep server awake...");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: "0.01" }),
    });

    const data = await res.json();
    console.log("✅ Ping response:", data.status || "OK");
  } catch (error) {
    console.error("❌ Ping failed:", error.message);
  }
});

console.log("✅ Cron job initialized to run every 10 minutes.");
