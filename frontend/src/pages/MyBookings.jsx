import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await bookingAPI.getMyBookings();
        setBookings(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b._id} className="border rounded-xl p-4 bg-white">
              <div className="font-semibold">Room: {b.room?.title || b.room}</div>
              <div>Move-in: {new Date(b.moveInDate).toLocaleDateString()}</div>
              <div>Duration: {b.duration} months</div>
              <div>Status: <span className="capitalize font-medium">{b.status}</span></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
