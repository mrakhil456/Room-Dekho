import React from 'react';
import { useSelector } from 'react-redux';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';

const SavedRooms = () => {
  const { rooms, favorites } = useSelector((state) => state.rooms);
  const saved = rooms.filter((room) => favorites.includes(room._id || room.id));

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="section-kicker mb-2">Your shortlist</p>
          <h1 className="text-3xl font-bold tracking-tight">Saved rooms</h1>
          <p className="text-gray-600 mt-2">Keep the places you love close while you decide.</p>
        </div>
        {saved.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {saved.map((room) => <RoomCard key={room._id || room.id} room={room} />)}
          </div>
        ) : (
          <div className="card px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Heart aria-hidden="true" className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold">No saved rooms yet</h2>
            <p className="mt-2 text-sm text-gray-600">Start exploring and save rooms you love.</p>
            <Link to="/search" className="primary-btn mt-6"><Search aria-hidden="true" className="h-4 w-4" />Explore rooms</Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedRooms;
