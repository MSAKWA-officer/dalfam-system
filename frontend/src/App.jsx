import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

import Home from './pages/Home';
import About from './pages/About';
import PigBreeding from './pages/PigBreeding';
import Tourism from './pages/Tourism';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import BookOnline from './pages/BookOnline'; // NEW: public online booking

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BreedingStock from './pages/BreedingStock';
import Litters from './pages/Litters';
import HealthRecords from './pages/HealthRecords';
import Packages from './pages/Packages';
import Bookings from './pages/Bookings';
import Users from './pages/Users';
import Messages from './features/messages/MessagesPage';
import BlogAdmin from './pages/BlogAdmin'; // NEW

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Public website */}
      <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="/pig-breeding" element={<PigBreeding />} />
       <Route path="/tourism" element={<Tourism />} />
       <Route path="/blog" element={<Blog />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/book" element={<BookOnline />} /> {/* NEW: /book */}
       

      {/* System (mfumo) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="breeding-stock" element={<BreedingStock />} />
        <Route path="litters" element={<Litters />} />
        <Route path="health-records" element={<HealthRecords />} />
        <Route path="packages" element={<Packages />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="blog" element={<BlogAdmin />} /> {/* NEW: /app/blog */}
        <Route
          path="users"
          element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
