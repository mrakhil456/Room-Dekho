import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRecentlyViewed, toggleFavorite } from '../store/roomsSlice';
import {MapPin, Bed, Bath, Heart, MessageCircle, Phone, AlertCircle, X, Calendar, User, Check } from 'lucide-react';
import { roomAPI, bookingAPI } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showContact, setShowContact] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    moveInDate: '',
    duration: 12,
    message: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.rooms.favorites);
  const isFavorite = favorites.includes(id);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to book a room');
      return;
    }
    setBookingLoading(true);
    try {
      await bookingAPI.createBooking({
        roomId: room._id || room.id,
        moveInDate: bookingData.moveInDate,
        duration: bookingData.duration,
        message: bookingData.message
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingForm(false);
        setBookingSuccess(false);
      }, 2000);
    } catch (error) {
      alert('Failed to submit booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await roomAPI.getRoomById(id);
        setRoom(response.data);
        dispatch(addRecentlyViewed(id));
        setError('');
      } catch (err) {
        setError('Failed to load room details');
        console.error('Error fetching room:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="pt-20 max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-bold text-red-900">Error</h3>
            <p className="text-red-700">{error || 'Room not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper to format location object
  const locationDisplay = typeof room.location === 'object'
    ? `${room.location.address}, ${room.location.city}, ${room.location.state}`
    : room.location;

  // Handle image URL - support both relative and absolute paths
  const mainImageUrl = getImageUrl(room.images?.[0], 'large');

  return (
    <div className="pt-20 max-w-6xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Images & Main Info */}
        <div>
          <div className="relative mb-8">
            <img 
              src={mainImageUrl} 
              alt={room.title} 
              className="w-full h-96 object-cover rounded-2xl shadow-xl" 
              onError={(e) => {
                console.error('Image failed to load:', mainImageUrl);
                e.target.src = 'https://via.placeholder.com/600x400?text=Room+Image';
              }}
            />
            <button onClick={()=>dispatch(toggleFavorite(id))} className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-2xl shadow-lg" aria-label="Toggle wishlist">
              <Heart className={`w-6 h-6 ${isFavorite?'fill-red-500 text-red-500':'text-gray-600'}`} />
            </button>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{room.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{locationDisplay}</span>
              </div>
              {room.isApproved && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ Verified listing</span>}
              <div className="flex items-center space-x-2">
                <Bed className="w-5 h-5" />
                <span>{room.bedrooms} Bed{room.bedrooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bath className="w-5 h-5" />
                <span>{room.bathrooms} Bath{room.bathrooms > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">₹{room.price}/month</span>
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="primary-btn px-8 py-3 text-lg font-semibold"
                >
                  Book Now
                </button>
              </div>
            </div>
            
            {/* Description */}
            {room.description && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">About this room</h3>
                <p className="text-gray-700 line-clamp-4">{room.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Amenities, Description, Contact */}
        <div className="space-y-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <div className="rounded-xl overflow-hidden h-64 bg-gray-100">
              <iframe title="Room location map" className="w-full h-full border-0" src={`https://www.openstreetmap.org/export/embed.html?bbox=${(room.location?.coordinates?.longitude||80.95)-.02}%2C${(room.location?.coordinates?.latitude||26.85)-.02}%2C${(room.location?.coordinates?.longitude||80.95)+.02}%2C${(room.location?.coordinates?.latitude||26.85)+.02}&layer=mapnik&marker=${room.location?.coordinates?.latitude||26.85}%2C${room.location?.coordinates?.longitude||80.95}`} loading="lazy"/>
            </div>
          </div>
          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <span>Amenities</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Calendar */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Availability</h2>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="font-medium py-2">{day}</div>
              ))}
              {Array(35).fill(0).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i - date.getDay());
                const isToday = i === date.getDay();
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded-lg font-medium transition-all ${
                      selectedDate.toDateString() === date.toDateString()
                        ? 'bg-blue-600 text-white shadow-md'
                        : isToday
                        ? 'bg-yellow-100 text-yellow-800 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Landlord */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => setShowContact(!showContact)}
              className="w-full flex items-center justify-center space-x-3 mb-6 py-4 px-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <MessageCircle className="w-6 h-6 text-gray-500" />
              <span className="font-semibold text-lg">Contact Landlord</span>
              <Phone className="w-6 h-6 text-gray-500" />
            </button>
            
            {showContact && (
              <div className="space-y-4 pt-6 border-t border-gray-100">
                {room.landlord && (
                  <>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {room.landlord.name?.[0]?.toUpperCase() || 'L'}
                      </div>
                      <div>
                        <h3 className="font-semibold">{room.landlord.name || 'Landlord'}</h3>
                        <p className="text-sm text-gray-600">Room Owner</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {room.landlord.phone && (
                        <a 
                          href={`tel:${room.landlord.phone}`} 
                          className="primary-btn flex items-center justify-center space-x-2 py-3"
                        >
                          <Phone className="w-5 h-5" />
                          <span>Call: {room.landlord.phone}</span>
                        </a>
                      )}
                      {room.landlord.email && (
                        <a 
                          href={`mailto:${room.landlord.email}`} 
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Email: {room.landlord.email}</span>
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">Book This Room</h2>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {bookingSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Booking Submitted!</h3>
                <p className="text-gray-600">The landlord will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Move-in Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.moveInDate}
                    onChange={(e) => setBookingData({...bookingData, moveInDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (months)
                  </label>
                  <select
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={18}>18 months</option>
                    <option value={24}>24 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Message to Landlord
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell the landlord about yourself and why you're interested..."
                    value={bookingData.message}
                    onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-semibold">₹{room.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{bookingData.duration} months</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-blue-600">₹{room.price * bookingData.duration}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full primary-btn py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {bookingLoading ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;