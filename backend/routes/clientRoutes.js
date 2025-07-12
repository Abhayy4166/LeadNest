const express = require("express");
const router = express.Router();
const { createClient } = require("../controllers/clientController");

// POST /api/clients
router.post("/", createClient);

module.exports = router;
