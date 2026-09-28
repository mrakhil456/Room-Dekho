const express = require('express');
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all rooms
router.get('/', roomController.getAllRooms);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Create room with multiple image uploads (protected)
router.post('/', auth, upload.array('images', 10), roomController.createRoom);

// Update room (protected, with optional image uploads)
router.put('/:id', auth, upload.array('images', 10), roomController.updateRoom);

// Delete room (protected)
router.delete('/:id', auth, roomController.deleteRoom);

// Approve room (admin only)
router.post('/:id/approve', auth, roomController.approveRoom);

// Add review to room (protected)
router.post('/:id/reviews', auth, roomController.addReview);

module.exports = router;
