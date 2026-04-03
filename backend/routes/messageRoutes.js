const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/messageController");
const { allMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);

module.exports = router;
