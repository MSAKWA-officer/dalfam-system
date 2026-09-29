import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';

const emptyForm = {
  packageId: '', customerName: '', customerEmail: '', customerPhone: '',
  numberOfGuests: 1, startDate: '', endDate: '', status: 'pending', notes: '',
};

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [b, p] = await Promise.all([api.get('/bookings'), api.get('/packages')]);
      setBookings(b.data);
      setPackages(p.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (b) => {
    setForm({
      packageId: b.packageId, customerName: b.customerName, customerEmail: b.customerEmail || '',
      customerPhone: b.customerPhone || '', numberOfGuests: b.numberOfGuests, startDate: b.startDate,
      endDate: b.endDate || '', status: b.status, notes: b.notes || '',
    });
    setEditingId(b.id);
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/bookings/${editingId}`, form);
      } else {
        await api.post('/bookings', form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save booking');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-black',
    confirmed: 'bg-green-100 text-black',
    completed: 'bg-blue-100 text-black',
    cancelled: 'bg-red-100 text-black',
  };

  const filteredBookings = bookings.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      b.customerName?.toLowerCase().includes(q) ||
      b.package?.name?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Bookings</h1>
          <p className="text-black text-base mt-1">Customer trip bookings across all packages.</p>
        </div>
        <button onClick={openCreate} className="bg-dalfam-green text-white px-4 py-2 rounded-lg font-medium hover:bg-dalfam-dark">
          + New Booking
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, package or status..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
      </div>

      <div className="rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gray-50 text-black text-left">
            <tr>
              <th className="px-4 py-3 font-bold">Customer</th>
              <th className="px-4 py-3 font-bold">Package</th>
              <th className="px-4 py-3 font-bold">Guests</th>
              <th className="px-4 py-3 font-bold">Start Date</th>
              <th className="px-4 py-3 font-bold">Total (TZS)</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-4 py-6 text-center text-black">Loading...</td></tr>}
            {!loading && filteredBookings.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-black">No bookings yet.</td></tr>
            )}
            {filteredBookings.map((b) => (
              <tr key={b.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-black">{b.customerName}</td>
                <td className="px-4 py-3 text-black">{b.package?.name}</td>
                <td className="px-4 py-3 text-black">{b.numberOfGuests}</td>
                <td className="px-4 py-3 text-black">{b.startDate}</td>
                <td className="px-4 py-3 text-black">{formatCurrency(b.totalAmount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor[b.status] || ''}`}>{b.status}</span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(b)} className="text-black underline">Edit</button>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(b.id)} className="text-black underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Booking' : 'New Booking'}>
        <form onSubmit={handleSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Tourism Package *</label>
            <select name="packageId" required value={form.packageId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
              <option value="">Select package</option>
              {packages.map((p) => <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Customer Name *</label>
              <input name="customerName" required value={form.customerName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Guests</label>
              <input type="number" min="1" name="numberOfGuests" value={form.numberOfGuests} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Email</label>
              <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Phone</label>
              <input name="customerPhone" value={form.customerPhone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Start Date *</label>
              <input type="date" name="startDate" required value={form.startDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {saving ? 'Saving...' : editingId ? 'Update Booking' : 'Create Booking'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Bookings;
