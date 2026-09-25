const session = require("express-session");
const passport = require("passport");

require("./config/passport");

const googleAuthRoutes = require("./routes/googleAuth");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");

const masterAgent = require("./agents/masterAgent");

const app = express();

app.use(cors());           // <-- add this
app.use(express.json());
app.use(
  session({
    secret: "nyaya_google_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", uploadRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);

const PORT = 5001;

app.get("/test", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

app.post("/analyze", authMiddleware, async (req, res) =>  {
    console.log("Analyze route hit!");
    console.log(req.body);

    try {
         const result = await masterAgent({
            ...req.body,
            userId: req.user.id
        });

        console.log(result);

        res.json(result);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            response: "Backend Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});