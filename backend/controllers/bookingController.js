const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res) => {
  try {
    const { roomId, moveInDate, duration, message } = req.body;
    if (req.user.role !== 'tenant') return res.status(403).json({ message: 'Only tenants can create bookings' });
    if (!roomId || !moveInDate || !Number.isInteger(Number(duration)) || Number(duration) < 1 || Number(duration) > 36) return res.status(400).json({ message: 'Valid roomId, moveInDate, and duration (1–36 months) are required' });
    if (message !== undefined && (typeof message !== 'string' || message.length > 1000)) return res.status(400).json({ message: 'Message must be 1000 characters or fewer' });
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.availability || !room.isApproved) return res.status(400).json({ message: 'This listing is not currently available for booking' });
    const existing = await Booking.findOne({ room: roomId, tenant: req.user.id, status: 'pending' });
    if (existing) return res.status(409).json({ message: 'You already have a pending booking for this room' });
    const booking = await Booking.create({ room: roomId, tenant: req.user.id, moveInDate, duration: Number(duration), message });
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) { console.error('Booking error:', error); res.status(500).json({ message: 'Failed to create booking' }); }
};

exports.getTenantBookings = async (req, res) => {
  try {
    if (req.user.role !== 'tenant') return res.status(403).json({ message: 'Tenant access required' });
    const bookings = await Booking.find({ tenant: req.user.id }).populate({ path:'room', populate:{path:'landlord',select:'name email phone'}}).sort({createdAt:-1});
    res.json(bookings);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch bookings' }); }
};

exports.getLandlordBookings = async (req, res) => {
  try {
    if (!['landlord','admin'].includes(req.user.role)) return res.status(403).json({ message: 'Landlord access required' });
    const filter = req.user.role === 'admin' ? {} : null;
    const bookings = filter ? await Booking.find(filter).populate('room tenant').sort({createdAt:-1}) : await Booking.find().populate({path:'room',match:{landlord:req.user.id}}).populate('tenant').sort({createdAt:-1});
    res.json(req.user.role === 'admin' ? bookings : bookings.filter(b=>b.room));
  } catch (error) { res.status(500).json({ message: 'Failed to fetch bookings' }); }
};

exports.getAllBookings = async (req,res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({message:'Admin access required'});
    res.json(await Booking.find().populate('room tenant').sort({createdAt:-1}));
  } catch { res.status(500).json({message:'Failed to fetch bookings'}); }
};

exports.updateBookingStatus = async (req,res) => {
  try {
    const {status}=req.body;
    if(!['pending','approved','rejected'].includes(status)) return res.status(400).json({message:'Invalid booking status'});
    const booking=await Booking.findById(req.params.id).populate('room');
    if(!booking) return res.status(404).json({message:'Booking not found'});
    if(req.user.role==='landlord' && booking.room?.landlord?.toString()!==req.user.id) return res.status(403).json({message:'Access denied'});
    if(req.user.role!=='landlord' && req.user.role!=='admin') return res.status(403).json({message:'Access denied'});
    booking.status=status; await booking.save();
    res.json(booking);
  } catch { res.status(500).json({message:'Failed to update booking'}); }
};
