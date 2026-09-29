import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  sowId: '', sireTag: '', farrowingDate: '', totalBorn: 0, bornAlive: 0,
  stillborn: 0, weaned: 0, weaningDate: '', notes: '',
};

const Litters = () => {
  const { user } = useAuth();
  const [litters, setLitters] = useState([]);
  const [sows, setSows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [l, s] = await Promise.all([
        api.get('/litters'),
        api.get('/breeding-stock', { params: { sex: 'female' } }),
      ]);
      setLitters(l.data);
      setSows(s.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (litter) => {
    setForm({
      sowId: litter.sowId, sireTag: litter.sireTag || '', farrowingDate: litter.farrowingDate,
      totalBorn: litter.totalBorn, bornAlive: litter.bornAlive, stillborn: litter.stillborn,
      weaned: litter.weaned, weaningDate: litter.weaningDate || '', notes: litter.notes || '',
    });
    setEditingId(litter.id);
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/litters/${editingId}`, form);
      } else {
        await api.post('/litters', form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save litter record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this litter record?')) return;
    try {
      await api.delete(`/litters/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filteredLitters = litters.filter((l) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      l.sow?.tagNumber?.toLowerCase().includes(q) ||
      l.sow?.name?.toLowerCase().includes(q) ||
      l.sireTag?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Litters &amp; Farrowing Records</h1>
        </div>
        <button onClick={openCreate} className="bg-dalfam-green text-white px-4 py-2 rounded-lg font-medium hover:bg-dalfam-dark">
          + Record Litter
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by sow or sire tag..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
      </div>

      <div className="rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gray-50 text-black text-left">
            <tr>
              <th className="px-4 py-3 font-bold">Sow</th>
              <th className="px-4 py-3 font-bold">Sire Tag</th>
              <th className="px-4 py-3 font-bold">Farrowing Date</th>
              <th className="px-4 py-3 font-bold">Total Born</th>
              <th className="px-4 py-3 font-bold">Born Alive</th>
              <th className="px-4 py-3 font-bold">Weaned</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-4 py-6 text-center text-black">Loading...</td></tr>}
            {!loading && filteredLitters.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-black">No litters recorded yet.</td></tr>
            )}
            {filteredLitters.map((l) => (
              <tr key={l.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-black">{l.sow?.tagNumber} {l.sow?.name ? `(${l.sow.name})` : ''}</td>
                <td className="px-4 py-3 text-black">{l.sireTag || '—'}</td>
                <td className="px-4 py-3 text-black">{l.farrowingDate}</td>
                <td className="px-4 py-3 text-black">{l.totalBorn}</td>
                <td className="px-4 py-3 text-black">{l.bornAlive}</td>
                <td className="px-4 py-3 text-black">{l.weaned}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(l)} className="text-black underline">Edit</button>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(l.id)} className="text-black underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Litter' : 'Record New Litter'}>
        <form onSubmit={handleSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Sow *</label>
              <select name="sowId" required value={form.sowId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="">Select sow</option>
                {sows.map((s) => (
                  <option key={s.id} value={s.id}>{s.tagNumber} {s.name ? `(${s.name})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Sire Tag</label>
              <input name="sireTag" value={form.sireTag} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Farrowing Date *</label>
            <input type="date" name="farrowingDate" required value={form.farrowingDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Total Born</label>
              <input type="number" name="totalBorn" value={form.totalBorn} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Born Alive</label>
              <input type="number" name="bornAlive" value={form.bornAlive} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Stillborn</label>
              <input type="number" name="stillborn" value={form.stillborn} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Weaned (count)</label>
              <input type="number" name="weaned" value={form.weaned} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Weaning Date</label>
              <input type="date" name="weaningDate" value={form.weaningDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {saving ? 'Saving...' : editingId ? 'Update Litter' : 'Save Litter'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Litters;
