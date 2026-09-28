import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard';
import { Plus, Edit3, Trash2, X, Upload, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom, deleteRoom, fetchUserRooms, updateRoom } from '../store/roomsSlice';

const LandlordDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const userRooms = useSelector(state => state.rooms.userRooms);
  const loading = useSelector(state => state.rooms.loading);
  const userRoomsStatus = useSelector(state => state.rooms.userRoomsStatus);
  const error = useSelector(state => state.rooms.error);
  
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch landlord's rooms on component mount or when user changes
  useEffect(() => {
    const landlordId = user?.id || user?._id;
    if (landlordId && user?.role === 'landlord') {
      console.log('Fetching rooms for landlord:', landlordId);
      dispatch(fetchUserRooms(landlordId));
    }
  }, [user?.id, dispatch]);

  // Log userRooms whenever they change
  useEffect(() => {
    console.log('LandlordDashboard - userRooms updated:', {
      count: userRooms.length,
      status: userRoomsStatus,
      error: error,
      rooms: userRooms.map(r => ({ _id: r._id, title: r.title, landlord: r.landlord }))
    });
  }, [userRooms, userRoomsStatus, error]);
  
  const [newRoom, setNewRoom] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    furnishingType: 'semi-furnished',
    amenities: []
  });

  const amenitiesList = ['WiFi', 'AC', 'TV', 'Kitchen', 'Parking', 'Gym', 'Security'];

  const handleAmenityChange = (amenity) => {
    setNewRoom(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    setFormError('');
    const files = Array.from(e.target.files);
    let validFiles = [];

    if (files.length + selectedFiles.length > 10) {
      setFormError('Maximum 10 images allowed');
      return;
    }

    files.forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isWithinSize = file.size <= 5 * 1024 * 1024;

      if (!isImage) {
        setFormError('Only image files are allowed. Please upload PNG, JPG, JPEG, or GIF.');
        return;
      }

      if (!isWithinSize) {
        setFormError('Each image must be 5MB or smaller.');
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles([...selectedFiles, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index].preview);
    
    setImagePreviews(newPreviews);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!newRoom.title || !newRoom.description || !newRoom.price || !newRoom.location.address || !newRoom.location.city || !newRoom.location.state) {
      setFormError('Please fill all required fields (Title, Description, Price, Address, City, State)');
      return;
    }

    if (imagePreviews.length === 0) {
      setFormError('Please upload at least one room photo');
      return;
    }

    try {
      // Create FormData for multi-part upload
      const formData = new FormData();
      
      // Add room data
      formData.append('title', newRoom.title);
      formData.append('description', newRoom.description);
      formData.append('price', Number(newRoom.price));
      formData.append('bedrooms', Number(newRoom.bedrooms));
      formData.append('bathrooms', Number(newRoom.bathrooms));
      formData.append('furnishingType', newRoom.furnishingType);
      
      // Add location as JSON string
      formData.append('location', JSON.stringify(newRoom.location));
      
      // Add amenities as JSON string
      formData.append('amenities', JSON.stringify(newRoom.amenities));
      
      // Add images
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      console.log('Submitting room with', selectedFiles.length, 'images');

      await dispatch(createRoom(formData)).unwrap();
      setSuccess('Room added successfully!');
      
      // Reset form
      setNewRoom({
        title: '',
        description: '',
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        location: { address: '', city: '', state: '', pincode: '' },
        furnishingType: 'semi-furnished',
        amenities: []
      });
      
      // Clear image previews
      imagePreviews.forEach(img => URL.revokeObjectURL(img.preview));
      setImagePreviews([]);
      setSelectedFiles([]);
      
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error creating room:', err);
      const errorMsg = typeof err === 'string'
        ? err
        : err?.response?.data?.message || err?.message || 'Failed to create room';
      setFormError(errorMsg);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    try {
      await dispatch(deleteRoom(roomId)).unwrap();
      setSuccess('Room deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError('Failed to delete room');
      console.error('Error deleting room:', err);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setNewRoom({
      title: room.title || '',
      description: room.description || '',
      price: room.price?.toString() || '',
      bedrooms: room.bedrooms || 1,
      bathrooms: room.bathrooms || 1,
      location: {
        address: room.location?.address || '',
        city: room.location?.city || '',
        state: room.location?.state || '',
        pincode: room.location?.pincode || ''
      },
      furnishingType: room.furnishingType || 'semi-furnished',
      amenities: room.amenities || []
    });
    // Set existing images as previews (without files)
    if (room.images && room.images.length > 0) {
      setImagePreviews(room.images.map(img => ({ preview: img, isExisting: true })));
    } else {
      setImagePreviews([]);
    }
    setSelectedFiles([]);
    setShowForm(true);
    setFormError('');
    setSuccess('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!newRoom.title || !newRoom.description || !newRoom.price || !newRoom.location.address || !newRoom.location.city || !newRoom.location.state) {
      setFormError('Please fill all required fields (Title, Description, Price, Address, City, State)');
      return;
    }

    try {
      const formData = new FormData();
      
      formData.append('title', newRoom.title);
      formData.append('description', newRoom.description);
      formData.append('price', Number(newRoom.price));
      formData.append('bedrooms', Number(newRoom.bedrooms));
      formData.append('bathrooms', Number(newRoom.bathrooms));
      formData.append('furnishingType', newRoom.furnishingType);
      formData.append('location', JSON.stringify(newRoom.location));
      formData.append('amenities', JSON.stringify(newRoom.amenities));
      
      // Add new images if any
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await dispatch(updateRoom({ roomId: editingRoom._id, roomData: formData })).unwrap();
      setSuccess('Room updated successfully!');
      
      // Reset form
      setNewRoom({
        title: '',
        description: '',
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        location: { address: '', city: '', state: '', pincode: '' },
        furnishingType: 'semi-furnished',
        amenities: []
      });
      
      setImagePreviews([]);
      setSelectedFiles([]);
      setEditingRoom(null);
      
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error updating room:', err);
      const errorMsg = typeof err === 'string'
        ? err
        : err?.response?.data?.message || err?.message || 'Failed to update room';
      setFormError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <button
              onClick={() => { setShowForm(true); setEditingRoom(null); setNewRoom({ title: '', description: '', price: '', bedrooms: 1, bathrooms: 1, location: { address: '', city: '', state: '', pincode: '' }, furnishingType: 'semi-furnished', amenities: [] }); setImagePreviews([]); setSelectedFiles([]); }}
              className="primary-btn flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Room</span>
            </button>
          </div>
        </div>
      </div>

      {(success || formError) && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {formError}
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingRoom ? 'Edit Room' : 'List a New Room'}</h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingRoom(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingRoom ? handleUpdateSubmit : handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Room Photos * (Up to 10)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="photo-input"
                  />
                  <label htmlFor="photo-input" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      {imagePreviews.length} photo{imagePreviews.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                          >
                            <Trash className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={newRoom.title}
                  onChange={(e) => setNewRoom({...newRoom, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Cozy 1BHK Apartment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Describe your room, facilities, and amenities..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price (₹/month) *</label>
                  <input
                    type="number"
                    required
                    value={newRoom.price}
                    onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newRoom.bedrooms}
                    onChange={(e) => setNewRoom({...newRoom, bedrooms: +e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={newRoom.bathrooms}
                    onChange={(e) => setNewRoom({...newRoom, bathrooms: +e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Furnishing</label>
                  <select
                    value={newRoom.furnishingType}
                    onChange={(e) => setNewRoom({...newRoom, furnishingType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location (Address) *</label>
                <input
                  type="text"
                  required
                  value={newRoom.location.address}
                  onChange={(e) => setNewRoom({...newRoom, location: {...newRoom.location, address: e.target.value}})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Street address, building name, etc."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={newRoom.location.city}
                    onChange={(e) => setNewRoom({...newRoom, location: {...newRoom.location, city: e.target.value}})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Lucknow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={newRoom.location.state}
                    onChange={(e) => setNewRoom({...newRoom, location: {...newRoom.location, state: e.target.value}})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Uttar Pradesh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={newRoom.location.pincode}
                    onChange={(e) => setNewRoom({...newRoom, location: {...newRoom.location, pincode: e.target.value}})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="226010"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                      <input
                        type="checkbox"
                        checked={newRoom.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`primary-btn flex-1 py-3 text-lg font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (editingRoom ? 'Updating...' : 'Creating...') : (editingRoom ? 'Update Room' : 'List Room')}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingRoom(null); }}
                  className="flex-1 py-3 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {userRoomsStatus === 'loading' ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 text-lg mt-4">Loading your listings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold">Error loading rooms: {error}</p>
          </div>
        ) : userRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No listings yet. Create your first listing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userRooms.map(room => (
              <div key={room._id || room.id} className="card relative group">
                <RoomCard room={room} />
                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all bg-white/90 p-1 rounded-lg shadow-md">
                  <button 
                    onClick={() => handleEditRoom(room)}
                    className="p-2 hover:bg-gray-100 rounded" 
                    title="Edit room"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id || room.id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors hover:bg-red-50"
                    title="Delete room"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;