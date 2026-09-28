import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import TenantDashboard from './components/TenantDashboard';
import LandlordDashboard from './components/LandlordDashboard';
import AdminDashboard from './components/AdminDashboard';
import RoomDetails from './pages/RoomDetails';
import ProtectedRoute from './components/ProtectedRoute';
import MyBookings from './pages/MyBookings';
import SavedRooms from './pages/SavedRooms';
import CompareRooms from './pages/CompareRooms';
import './index.css';
import HealthMonitor from './components/HealthMonitor';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HealthMonitor />
        <BrowserRouter>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/room/:id" element={<RoomDetails />} />
              <Route path="/wishlist" element={<SavedRooms />} />
              <Route path="/compare" element={<CompareRooms />} />
              <Route path="/tenant" element={
                <ProtectedRoute allowedRoles={['tenant']}>
                  <TenantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute allowedRoles={['tenant']}>
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/landlord" element={
                <ProtectedRoute allowedRoles={['landlord']}>
                  <LandlordDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;