import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms } from '../store/roomsSlice';
import RoomCard from '../components/RoomCard';
import { ArrowRight, BadgeCheck, Building2, CheckCircle2, MapPin, Search, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const popularLocations = ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar'];

const Home = () => {
  const dispatch = useDispatch();
  const { rooms, status } = useSelector(state => state.rooms);
  const [searchParams, setSearchParams] = useState({ location: '', minPrice: '' });

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRooms());
  }, [status, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchParams.location) params.q = searchParams.location;
    if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
    dispatch(fetchRooms(params));
  };

  const setLocation = (location) => setSearchParams(prev => ({ ...prev, location }));

  return (
    <main className="min-h-screen" style={{ background: "var(--page)" }}>
      <section className="hero-shell relative overflow-hidden">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 relative z-10">
          <div className="grid lg:grid-cols-[1.08fr_.92fr] gap-10 lg:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-sm font-semibold text-amber-200 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4" /> Smarter room hunting, made simple
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.03]">
                Your next room is <span className="text-amber-300">closer</span> than you think.
              </h1>
              <p className="mt-6 text-base sm:text-lg lg:text-xl leading-8 text-slate-200 max-w-2xl">
                Discover verified rooms, compare your favorites, explore locations, and book with confidence — all in one place.
              </p>

              <form onSubmit={handleSearch} className="mt-8 bg-white rounded-2xl p-2 shadow-2xl shadow-slate-950/30 max-w-3xl">
                <div className="grid sm:grid-cols-[1fr_170px_auto] gap-2">
                  <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Where do you want to live?"
                      className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    />
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100">
                    <span className="text-slate-500">₹</span>
                    <input
                      type="number"
                      placeholder="Min budget"
                      className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                      value={searchParams.minPrice}
                      onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                    />
                  </label>
                  <button type="submit" className="hero-search-btn">
                    <Search className="w-5 h-5" /> Search rooms
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-300 mr-1">Popular:</span>
                {popularLocations.map(location => (
                  <button key={location} type="button" onClick={() => setLocation(location)} className="hero-chip">
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="hero-property-card">
                <div className="hero-property-image">
                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85"
                    alt="Bright modern furnished room"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="hero-badge"><BadgeCheck className="w-4 h-4" /> Verified</span>
                    <span className="hero-badge hero-badge-light">Popular</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-sm text-amber-200 font-semibold">Gomti Nagar, Lucknow</p>
                    <h2 className="text-2xl font-bold mt-1">Modern private room</h2>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-bold">₹8,500 <small className="text-sm font-normal text-slate-300">/ month</small></span>
                      <span className="text-sm text-slate-200">★ 4.9</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-200 text-center py-4">
                  <div><p className="text-xs text-slate-500">Bedrooms</p><p className="font-bold text-slate-900">2</p></div>
                  <div><p className="text-xs text-slate-500">Furnished</p><p className="font-bold text-slate-900">Yes</p></div>
                  <div><p className="text-xs text-slate-500">Move-in</p><p className="font-bold text-slate-900">Ready</p></div>
                </div>
              </div>
              <div className="hero-float-card hero-float-top"><ShieldCheck className="w-5 h-5 text-emerald-600" /><div><p className="text-xs text-slate-500">Safety first</p><p className="font-bold text-slate-900">Verified listings</p></div></div>
              <div className="hero-float-card hero-float-bottom"><Users className="w-5 h-5 text-amber-600" /><div><p className="text-xs text-slate-500">Community</p><p className="font-bold text-slate-900">For students & pros</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-7 z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden">
          {[
            [ShieldCheck, 'Verified', 'Listings checked'],
            [Building2, 'Real homes', 'Updated by owners'],
            [CheckCircle2, 'Simple booking', 'Less paperwork'],
            [Users, 'Local community', 'Students & professionals'],
          ].map(([Icon, title, subtitle]) => (
            <div key={title} className="flex items-center gap-3 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r last:border-0 border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
              <div><p className="font-bold text-slate-900 text-sm sm:text-base">{title}</p><p className="text-xs sm:text-sm text-slate-500">{subtitle}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="section-kicker">Explore RoomDekho</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">Rooms worth seeing</h2>
            <p className="text-slate-500 mt-2">Handy options for your next move, all in one place.</p>
          </div>
          <Link to="/search" className="inline-flex items-center gap-2 font-bold text-amber-700 hover:text-amber-800">View all rooms <ArrowRight className="w-4 h-4" /></Link>
        </div>

        {rooms.length === 0 ? (
          <div className="rounded-2xl text-center py-16 px-6 shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><Building2 /></div>
            <p className="text-slate-700 font-semibold mt-4">No rooms available yet.</p>
            <p className="text-slate-500 mt-1">Check back soon for new listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {rooms.map(room => <RoomCard key={room._id || room.id} room={room} />)}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
