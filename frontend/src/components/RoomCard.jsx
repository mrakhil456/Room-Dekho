import React from 'react';
import { Heart, MapPin, Bed, Bath, User, Phone, GitCompare, BadgeCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, toggleCompare } from '../store/roomsSlice';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const RoomCard = ({ room }) => {
  const dispatch = useDispatch();
  const { favorites, compare } = useSelector(s => s.rooms);
  const id = room._id || room.id;
  const isFavorite = favorites.includes(id);
  const isCompared = compare.includes(id);
  const locationDisplay = typeof room.location === 'object'
    ? [room.location.address, room.location.city, room.location.state].filter(Boolean).join(', ')
    : room.location;
  return <div className="card overflow-hidden group">
    <div className="relative">
      <img src={getImageUrl(room.images?.[0])} alt={room.title} loading="lazy" className="room-card-image w-full h-44 sm:h-52 object-cover" onError={e=>{e.currentTarget.src='https://via.placeholder.com/300x200?text=No+Image'}} />
      <div className="absolute top-2 left-2 flex gap-2">
        {room.isApproved && <span className="verified-badge"><BadgeCheck className="w-3 h-3"/> Verified</span>}
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        <button aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isFavorite} onClick={()=>dispatch(toggleFavorite(id))} className="room-action"><Heart className={`w-5 h-5 ${isFavorite?'fill-red-500 text-red-500':'text-gray-600'}`}/></button>
        <button aria-label={isCompared ? 'Remove from comparison' : 'Compare room'} aria-pressed={isCompared} onClick={()=>dispatch(toggleCompare(id))} className={`room-action ${isCompared?'selected':''}`}><GitCompare className="w-5 h-5"/></button>
      </div>
    </div>
    <div className="p-3 sm:p-4">
      <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">{room.title}</h3>
      <div className="flex items-start gap-1 mb-3 text-gray-600"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0"/><p className="text-xs sm:text-sm truncate">{locationDisplay || 'Location not specified'}</p></div>
      <div className="flex items-center justify-between mb-3"><span className="text-xl font-bold text-blue-600">₹{room.price}<span className="ml-1 text-xs font-medium text-gray-500">/ month</span></span><div className="flex gap-3 text-xs text-gray-600"><span className="flex items-center gap-1"><Bed className="w-4 h-4"/>{room.bedrooms}</span><span className="flex items-center gap-1"><Bath className="w-4 h-4"/>{room.bathrooms}</span></div></div>
      {room.amenities?.length>0 && <ul className="flex min-h-7 flex-wrap gap-1 mb-4">{room.amenities.slice(0,3).map((a,i)=><li key={i} className="amenity-chip">{a}</li>)}</ul>}
      {room.landlord && <div className="mb-4 p-2.5 bg-gray-50 rounded-xl border border-gray-200"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-600"/><p className="font-semibold text-xs sm:text-sm truncate">{typeof room.landlord==='object'?room.landlord.name:'Landlord'}</p></div>{typeof room.landlord==='object'&&room.landlord.phone&&<div className="flex items-center gap-2 mt-1"><Phone className="w-4 h-4 text-gray-600"/><span className="text-xs text-gray-600">{room.landlord.phone}</span></div>}</div>}
      <Link to={`/room/${id}`} className="primary-btn w-full block text-center py-2 text-sm">View Details</Link>
    </div>
  </div>;
};
export default RoomCard;
