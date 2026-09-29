import React from 'react';

const StatCard = ({ label, value, accent = 'text-dalfam-green' }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-bold mt-1 ${accent}`}>{value}</p>
  </div>
);

export default StatCard;
