import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roomAPI } from '../services/api';

const readIds = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};
const writeIds = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (params = {}, { rejectWithValue }) => {
  try { return (await roomAPI.getAllRooms(params)).data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms'); }
});
export const fetchUserRooms = createAsyncThunk('rooms/fetchUserRooms', async (userId, { rejectWithValue }) => {
  try { return (await roomAPI.getRoomsByLandlord(userId)).data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Failed to fetch your rooms'); }
});
export const createRoom = createAsyncThunk('rooms/createRoom', async (roomData, { rejectWithValue }) => {
  try { return (await roomAPI.createRoom(roomData)).data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create room'); }
});
export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (roomId, { rejectWithValue }) => {
  try { await roomAPI.deleteRoom(roomId); return roomId; }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Failed to delete room'); }
});
export const updateRoom = createAsyncThunk('rooms/updateRoom', async ({ roomId, roomData }, { rejectWithValue }) => {
  try { return (await roomAPI.updateRoom(roomId, roomData)).data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update room'); }
});

const initialState = {
  rooms: [], userRooms: [], status: 'idle', userRoomsStatus: 'idle', loading: false, error: null,
  favorites: readIds('roomdekho_wishlist'), compare: readIds('roomdekho_compare'), recentlyViewed: readIds('roomdekho_recent')
};

const roomsSlice = createSlice({
  name: 'rooms', initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      const i = state.favorites.indexOf(id);
      if (i > -1) state.favorites.splice(i, 1); else state.favorites.unshift(id);
      writeIds('roomdekho_wishlist', state.favorites);
    },
    toggleCompare: (state, action) => {
      const id = action.payload;
      const i = state.compare.indexOf(id);
      if (i > -1) state.compare.splice(i, 1);
      else if (state.compare.length < 3) state.compare.unshift(id);
      writeIds('roomdekho_compare', state.compare);
    },
    addRecentlyViewed: (state, action) => {
      const id = action.payload;
      state.recentlyViewed = [id, ...state.recentlyViewed.filter(x => x !== id)].slice(0, 8);
      writeIds('roomdekho_recent', state.recentlyViewed);
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(id => id !== action.payload); writeIds('roomdekho_wishlist', state.favorites);
    },
    clearCompare: (state) => { state.compare = []; writeIds('roomdekho_compare', []); },
    clearRooms: (state) => { state.userRooms=[]; state.rooms=[]; state.status='idle'; state.userRoomsStatus='idle'; state.loading=false; state.error=null; }
  },
  extraReducers: (builder) => builder
    .addCase(fetchRooms.pending, s => { s.status='loading'; })
    .addCase(fetchRooms.fulfilled, (s,a) => { s.rooms=a.payload; s.status='succeeded'; s.error=null; })
    .addCase(fetchRooms.rejected, (s,a) => { s.error=a.payload; s.status='failed'; })
    .addCase(fetchUserRooms.pending, s => { s.userRoomsStatus='loading'; })
    .addCase(fetchUserRooms.fulfilled, (s,a) => { s.userRooms=a.payload; s.userRoomsStatus='succeeded'; s.error=null; })
    .addCase(fetchUserRooms.rejected, (s,a) => { s.error=a.payload; s.userRoomsStatus='failed'; })
    .addCase(createRoom.pending, s => { s.loading=true; s.error=null; })
    .addCase(createRoom.fulfilled, (s,a) => { s.loading=false; s.userRooms.push(a.payload); })
    .addCase(createRoom.rejected, (s,a) => { s.loading=false; s.error=a.payload; })
    .addCase(updateRoom.fulfilled, (s,a) => { const i=s.userRooms.findIndex(r=>r._id===a.payload._id); if(i>-1)s.userRooms[i]=a.payload; })
    .addCase(deleteRoom.fulfilled, (s,a) => { s.userRooms=s.userRooms.filter(r=>r._id!==a.payload); })
});
export const { toggleFavorite, toggleCompare, addRecentlyViewed, removeFavorite, clearCompare, clearRooms } = roomsSlice.actions;
export default roomsSlice.reducer;
