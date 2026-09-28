import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RoomCard from './RoomCard';
import { Search, Filter, MapPin } from 'lucide-react';
import { fetchRooms } from '../store/roomsSlice';

const TenantDashboard = () => {
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.rooms.rooms);
  const status = useSelector(state => state.rooms.status);

  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch all rooms when component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRooms());
    }
  }, [status, dispatch]);

  const handleSearch = () => {
    const params = {};
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    dispatch(fetchRooms(params));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min price"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max price"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No rooms available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map(room => (
              <RoomCard key={room._id || room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
