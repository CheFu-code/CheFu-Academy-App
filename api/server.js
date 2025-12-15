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
app.use("/api", notificationRoutes); 
app.use("/api/paypal-email", require("./email"));
app.use("/api/email", require("./routes/email"));

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});

app.get("/auth/github/callback", async (req, res) => {
    const code = req.query.code;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!code) return res.status(400).send("Missing code");
    if (!clientId) return res.status(400).send("Missing client ID");
    if (!clientSecret) return res.status(400).send("Missing client secret");

    try {
        // 1. Exchange code for access token
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const accessToken = tokenRes.data.access_token;

        // 2. Get GitHub user
        const userRes = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        const githubUser = userRes.data;

        // 3. Create Firebase custom token
        const firebaseToken = await admin
            .auth()
            .createCustomToken(githubUser.id.toString(), {
                github: {
                    username: githubUser.login,
                    avatar: githubUser.avatar_url,
                },
            });

        // 4. Redirect to app with custom token
        return res.redirect(
            `chefu-academy://github-auth?token=${firebaseToken}`
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send("Auth failed");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 🟡 CRON JOB: ping every 14 minutes to prevent Render from pausing

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
