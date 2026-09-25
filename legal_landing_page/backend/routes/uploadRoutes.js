const express = require("express");
const multer = require("multer");
const path = require("path");
const { getAllLawyers } = require("../database/lawyerModel");
const {
    getLatestSpecialization
} = require("../database/recommendationModel");

const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// POST /upload
router.post("/", upload.single("document"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    res.json({
        success: true,
        filename: req.file.filename,
        path: req.file.path
    });

});

// GET all lawyers
router.get("/lawyers", async (req, res) => {
    try {

        const lawyers = await getAllLawyers();

        res.json({
            success: true,
            lawyers
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch lawyers"
        });

    }
});
router.get("/recommended-specialization", async (req, res) => {

    try {

        const specialization =
            await getLatestSpecialization();

        res.json({
            success: true,
            specialization
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;