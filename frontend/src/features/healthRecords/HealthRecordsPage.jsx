import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  breedingStockId: '', litterId: '', recordType: 'vaccination', description: '',
  dateAdministered: '', administeredBy: '', nextDueDate: '', notes: '',
};

const HealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [litters, setLitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [r, a, l] = await Promise.all([
        api.get('/health-records'),
        api.get('/breeding-stock'),
        api.get('/litters'),
      ]);
      setRecords(r.data);
      setAnimals(a.data);
      setLitters(l.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setModalOpen(true); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.breedingStockId) payload.breedingStockId = null;
      if (!payload.litterId) payload.litterId = null;
      await api.post('/health-records', payload);
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save health record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this health record?')) return;
    try {
      await api.delete(`/health-records/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const typeColor = {
    vaccination: 'bg-blue-100 text-black',
    treatment: 'bg-purple-100 text-black',
    checkup: 'bg-green-100 text-black',
    mortality: 'bg-red-100 text-black',
  };

  const filteredRecords = records.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const subject = r.animal ? `${r.animal.tagNumber} ${r.animal.name || ''}` : r.litter ? `litter ${r.litter.id}` : '';
    return (
      subject.toLowerCase().includes(q) ||
      r.recordType?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Health &amp; Vaccination Records</h1>

        </div>
        <button onClick={openCreate} className="bg-dalfam-green text-white px-4 py-2 rounded-lg font-medium hover:bg-dalfam-dark">
          + Add Record
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by subject, type or description..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
      </div>

      <div className="rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gray-50 text-black text-left">
            <tr>
              <th className="px-4 py-3 font-bold">Subject</th>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold">Description</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Next Due</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-black">Loading...</td></tr>}
            {!loading && filteredRecords.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-black">No health records yet.</td></tr>
            )}
            {filteredRecords.map((r) => (
              <tr key={r.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-black">
                  {r.animal ? `${r.animal.tagNumber}${r.animal.name ? ' (' + r.animal.name + ')' : ''}` : r.litter ? `Litter #${r.litter.id}` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeColor[r.recordType] || ''}`}>{r.recordType}</span>
                </td>
                <td className="px-4 py-3 text-black">{r.description}</td>
                <td className="px-4 py-3 text-black">{r.dateAdministered}</td>
                <td className="px-4 py-3 text-black">{r.nextDueDate || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(r.id)} className="text-black underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Health Record">
        <form onSubmit={handleSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Animal (optional)</label>
              <select name="breedingStockId" value={form.breedingStockId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="">— None —</option>
                {animals.map((a) => <option key={a.id} value={a.id}>{a.tagNumber} {a.name ? `(${a.name})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Litter (optional)</label>
              <select name="litterId" value={form.litterId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="">— None —</option>
                {litters.map((l) => <option key={l.id} value={l.id}>Litter #{l.id} ({l.farrowingDate})</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Record Type *</label>
            <select name="recordType" value={form.recordType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
              <option value="vaccination">Vaccination</option>
              <option value="treatment">Treatment</option>
              <option value="checkup">Checkup</option>
              <option value="mortality">Mortality</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Description *</label>
            <input name="description" required value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" placeholder="e.g. Classical Swine Fever vaccine" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Date Administered *</label>
              <input type="date" name="dateAdministered" required value={form.dateAdministered} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Next Due Date</label>
              <input type="date" name="nextDueDate" value={form.nextDueDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Administered By</label>
            <input name="administeredBy" value={form.administeredBy} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" placeholder="Veterinarian / staff name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Record'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HealthRecords;
