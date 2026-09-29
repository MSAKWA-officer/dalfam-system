import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stockStats, setStockStats] = useState({ total: 0, active: 0, females: 0, males: 0 });
  const [bookingStats, setBookingStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, b] = await Promise.all([
          api.get('/breeding-stock/stats'),
          api.get('/bookings/stats'),
        ]);
        setStockStats(s.data);
        setBookingStats(b.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const StatBlock = ({ label, value }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-black">{label}</p>
      <p className="text-3xl font-serif font-extrabold text-black mt-2">
        {loading ? '...' : value}
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black">
      <h1 className="text-3xl font-serif font-extrabold text-black">
        Welcome back, {user?.name?.split(' ')[0]} 
      </h1>


      <h2 className="text-xl font-serif font-bold text-black mt-10 mb-4 border-b border-gray-200 pb-2">
         Pig Breeding Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <StatBlock label="Total Animals" value={stockStats.total} />
        <StatBlock label="Active" value={stockStats.active} />
        <StatBlock label="Females (Sows)" value={stockStats.females} />
        <StatBlock label="Males (Boars)" value={stockStats.males} />
      </div>

      <h2 className="text-xl font-serif font-bold text-black mt-10 mb-4 border-b border-gray-200 pb-2">
         Tourism Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <StatBlock label="Total Bookings" value={bookingStats.total} />
        <StatBlock label="Pending" value={bookingStats.pending} />
        <StatBlock label="Confirmed" value={bookingStats.confirmed} />
        <StatBlock label="Completed" value={bookingStats.completed} />
      </div>
    </div>
  );
};

export default Dashboard;
