import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Public-facing registration is intended for FIRST-TIME SETUP ONLY (creates the first admin).
// After that, new staff/admin accounts are created from the User Management page by an admin.
const Register = () => {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(form);
    if (ok) navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dalfam-dark px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-dalfam-dark">Initial System Setup</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create the first Administrator account for DALFAM. Additional staff accounts can be added later from User Management.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name" required value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password" required value={form.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Admin Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-dalfam-green font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
