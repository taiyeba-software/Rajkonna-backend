const express = require("express");

const router = express.Router();

// Basic placeholder routes so the app can mount this router during tests.
// Real implementations live in src/controllers/product.controller.js (if present).
router.get("/", (req, res) => {
	res.status(200).json({ message: "products route placeholder" });
});

module.exports = router;
