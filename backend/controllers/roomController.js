const Room = require('../models/Room');
const mongoose = require('mongoose');
const escapeRegex = (value) => String(value).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get all rooms or rooms by landlord/search filters
exports.getAllRooms = async (req, res) => {
  try {
    const {
      landlord,
      q,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      state,
      furnishingType,
      availability,
      approved,
    } = req.query;

    console.log('\n========== GET ALL ROOMS ==========');
    console.log('Query params:', { landlord, q, minPrice, maxPrice, bedrooms, bathrooms, city, state, furnishingType, availability });

    let filter = {};

    if (landlord) {
      if (!mongoose.Types.ObjectId.isValid(landlord)) {
        console.error('Invalid ObjectId format:', landlord);
        return res.status(400).json({ message: 'Invalid landlord ID format' });
      }
      filter.landlord = new mongoose.Types.ObjectId(landlord);
      console.log('Using filter for landlord:', landlord);
    }

    if (q) {
      const regex = new RegExp(escapeRegex(q), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { 'location.address': regex },
        { 'location.city': regex },
        { 'location.state': regex },
        { amenities: regex },
      ];
      console.log('Using text search filter for query:', q);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
      console.log('Using price range filter:', filter.price);
    }

    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
      console.log('Using bedrooms filter:', filter.bedrooms);
    }

    if (bathrooms) {
      filter.bathrooms = Number(bathrooms);
      console.log('Using bathrooms filter:', filter.bathrooms);
    }

    if (city) {
      filter['location.city'] = new RegExp(escapeRegex(city), 'i');
      console.log('Using city filter:', city);
    }

    if (state) {
      filter['location.state'] = new RegExp(escapeRegex(state), 'i');
      console.log('Using state filter:', state);
    }

    if (furnishingType) {
      filter.furnishingType = furnishingType;
      console.log('Using furnishing filter:', furnishingType);
    }

    if (approved === 'true' || approved === 'false') filter.isApproved = approved === 'true';

    if (availability !== undefined) {
      if (availability === 'true' || availability === 'false') {
        filter.availability = availability === 'true';
        console.log('Using availability filter:', filter.availability);
      }
    }

    const rooms = await Room.find(filter).populate('landlord', 'name');
    console.log('Rooms found:', rooms.length);
    if (rooms.length > 0) {
      rooms.forEach(r => {
        console.log(`  - ${r.title} | Landlord: ${r.landlord?.name}`);
      });
    }
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to update room' });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('landlord', 'name')
      .populate('reviews.user', 'name profileImage');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Create a room
exports.createRoom = async (req, res) => {
  try {
    if (req.user.role !== 'landlord' && req.user.role !== 'admin') return res.status(403).json({ message: 'Only landlords can create listings' });
    const { title, description, price, location, amenities, bedrooms, bathrooms, furnishingType } = req.body;

    console.log('Creating room with data:', { title, description, price, bedrooms, bathrooms });
    console.log('Files received:', req.files ? req.files.length : 0);

    // Validate required fields
    if (!title || !description || !price || !bedrooms || !bathrooms) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, price, bedrooms, bathrooms' 
      });
    }

    // Parse location and amenities if they are JSON strings (from FormData)
    let parsedLocation = location;
    let parsedAmenities = amenities || [];

    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        console.error('Error parsing location:', e.message);
        return res.status(400).json({ message: 'Invalid location format' });
      }
    }

    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        console.error('Error parsing amenities:', e.message);
        parsedAmenities = [];
      }
    }

    // Ensure parsedAmenities is an array
    if (!Array.isArray(parsedAmenities)) {
      parsedAmenities = [];
    }

    // Validate location object
    if (!parsedLocation || !parsedLocation.address || !parsedLocation.city || !parsedLocation.state) {
      return res.status(400).json({ 
        message: 'Location must include address, city, and state' 
      });
    }

    // Get image paths from uploaded files
    const images = req.files && req.files.length > 0 
      ? req.files.map(file => `/uploads/${file.filename}`) 
      : [];

    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const room = new Room({
      title,
      description,
      price: Number(price),
      location: parsedLocation,
      amenities: parsedAmenities,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      furnishingType: furnishingType || 'unfurnished',
      images,
      landlord: req.user.id,
    });

    console.log('\\n=== CREATING ROOM ===');
    console.log('Room object created, saving to database...');
    await room.save();
    console.log('Room saved with landlord:', room.landlord);
    await room.populate('landlord', 'name');
    console.log('Room saved successfully to DB:', {
      _id: room._id,
      title: room.title,
      landlord: room.landlord._id,
      landlordName: room.landlord.name
    });
    console.log('=== END CREATING ROOM ===\\n');
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room' });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is the landlord
    if (room.landlord.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this room' });
    }

    // Only allow explicitly editable fields; never accept ownership, approval, ratings, or system fields.
    const allowed = ['title', 'description', 'price', 'location', 'amenities', 'bedrooms', 'bathrooms', 'furnishingType', 'availability'];
    const updateData = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) updateData[key] = req.body[key];
    }
    if (typeof updateData.location === 'string') {
      try { updateData.location = JSON.parse(updateData.location); }
      catch { return res.status(400).json({ message: 'Invalid location format' }); }
    }
    if (typeof updateData.amenities === 'string') {
      try { updateData.amenities = JSON.parse(updateData.amenities); }
      catch { return res.status(400).json({ message: 'Invalid amenities format' }); }
    }
    for (const key of ['price', 'bedrooms', 'bathrooms']) {
      if (updateData[key] !== undefined) {
        updateData[key] = Number(updateData[key]);
        if (!Number.isFinite(updateData[key]) || updateData[key] < 0) return res.status(400).json({ message: `Invalid ${key}` });
      }
    }
    if (updateData.amenities !== undefined && !Array.isArray(updateData.amenities)) return res.status(400).json({ message: 'Amenities must be an array' });
    if (req.files?.length) updateData.images = [...(room.images || []), ...req.files.map(file => `/uploads/${file.filename}`)];
    Object.assign(room, updateData);
    await room.save();
    await room.populate('landlord', 'name');

    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is the landlord
    if (room.landlord.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Add review to room
exports.addReview = async (req, res) => {
  try {
    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
    const rating = Number(req.body.rating);
    if (!comment || comment.length > 1000) return res.status(400).json({ message: 'Comment is required and must be 1000 characters or fewer' });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be an integer from 1 to 5' });

    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const review = {
      user: req.user.id,
      comment,
      rating,
    };

    room.reviews.push(review);

    // Calculate average rating
    const totalRating = room.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    room.rating = (totalRating / room.reviews.length).toFixed(1);

    await room.save();
    await room.populate('reviews.user', 'name profileImage');

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Approve room (admin only)
exports.approveRoom = async (req, res) => {
  try {
    const User = require('../models/User');
    const adminUser = await User.findById(req.user.id);
    
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('landlord', 'name');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room approved successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
