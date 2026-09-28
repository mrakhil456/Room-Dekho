import React from 'react';
import { useSelector } from 'react-redux';
import RoomCard from '../components/RoomCard';
const SavedRooms=()=>{const {rooms,favorites}=useSelector(s=>s.rooms);const saved=rooms.filter(r=>favorites.includes(r._id||r.id));return <div className="min-h-screen bg-gray-50 pt-20 pb-12"><div className="max-w-7xl mx-auto px-4"><h1 className="text-3xl font-bold mb-2">Wishlist</h1><p className="text-gray-600 mb-8">Your saved rooms are kept in this browser.</p>{saved.length?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{saved.map(r=><RoomCard key={r._id} room={r}/>)}</div>:<div className="bg-white rounded-2xl p-10 text-center text-gray-500">No saved rooms yet. Tap the heart on any room to add it.</div>}</div></div>};export default SavedRooms;
