import React, { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { getAssetUrl } from '../../utils/format';

const emptyForm = {
  tagNumber: '', name: '', breed: '', sex: 'female', dateOfBirth: '',
  sourceType: 'born_on_farm', status: 'active', weightKg: '', notes: '',
  isPublic: false,
};

const BreedingStock = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/breeding-stock', { params: search ? { search } : {} });
      setAnimals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreate = () => { setForm(emptyForm); setEditingId(null); resetImage(); setModalOpen(true); };
  const openEdit = (animal) => {
    setForm({
      tagNumber: animal.tagNumber, name: animal.name || '', breed: animal.breed, sex: animal.sex,
      dateOfBirth: animal.dateOfBirth || '', sourceType: animal.sourceType, status: animal.status,
      weightKg: animal.weightKg || '', notes: animal.notes || '',
      isPublic: !!animal.isPublic,
    });
    setEditingId(animal.id);
    resetImage();
    setImagePreview(animal.imageUrl ? getAssetUrl(animal.imageUrl) : null);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // multipart/form-data because we may be sending a photo
      const fd = new FormData();
      fd.append('tagNumber', form.tagNumber);
      fd.append('name', form.name);
      fd.append('breed', form.breed);
      fd.append('sex', form.sex);
      fd.append('dateOfBirth', form.dateOfBirth);
      fd.append('sourceType', form.sourceType);
      fd.append('status', form.status);
      fd.append('weightKg', form.weightKg);
      fd.append('notes', form.notes);
      fd.append('isPublic', form.isPublic);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/breeding-stock/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/breeding-stock', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this animal record? This cannot be undone.')) return;
    try {
      await api.delete(`/breeding-stock/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const statusColor = {
    active: 'bg-green-100 text-black',
    quarantine: 'bg-yellow-100 text-black',
    sold: 'bg-blue-100 text-black',
    deceased: 'bg-gray-200 text-black',
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Breeding Stock</h1>
          <p className="text-black text-base mt-1">Manage sows, boars and herd genetics.</p>
        </div>
        <button onClick={openCreate} className="bg-dalfam-green text-white px-4 py-2 rounded-lg font-medium hover:bg-dalfam-dark">
          + Add Animal
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search by tag, name or breed..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
        <button onClick={load} className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-black hover:bg-gray-50">Search</button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gray-50 text-black text-left">
            <tr>
              <th className="px-4 py-3 font-bold">Photo</th>
              <th className="px-4 py-3 font-bold">Tag #</th>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Breed</th>
              <th className="px-4 py-3 font-bold">Sex</th>
              <th className="px-4 py-3 font-bold">Weight (kg)</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Public</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-black">Loading...</td></tr>
            )}
            {!loading && animals.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-black">No animals recorded yet.</td></tr>
            )}
            {animals.map((a) => (
              <tr key={a.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  {a.imageUrl ? (
                    <img src={getAssetUrl(a.imageUrl)} alt={a.name || a.tagNumber} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-black">No photo</div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-black">{a.tagNumber}</td>
                <td className="px-4 py-3 text-black">{a.name || '—'}</td>
                <td className="px-4 py-3 text-black">{a.breed}</td>
                <td className="px-4 py-3 capitalize text-black">{a.sex}</td>
                <td className="px-4 py-3 text-black">{a.weightKg || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor[a.status] || ''}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3">
                  {a.isPublic ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-dalfam-gold/20 text-black">On website</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-black">Hidden</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(a)} className="text-black underline">Edit</button>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(a.id)} className="text-black underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Animal' : 'Add Breeding Animal'}>
        <form onSubmit={handleSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Tag Number *</label>
              <input name="tagNumber" required value={form.tagNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Breed *</label>
              <input name="breed" required value={form.breed} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Sex *</label>
              <select name="sex" value={form.sex} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="female">Female (Sow)</option>
                <option value="male">Male (Boar)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Weight (kg)</label>
              <input type="number" step="0.1" name="weightKg" value={form.weightKg} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Source</label>
              <select name="sourceType" value={form.sourceType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="born_on_farm">Born on Farm</option>
                <option value="purchased">Purchased</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="active">Active</option>
                <option value="quarantine">Quarantine</option>
                <option value="sold">Sold</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-1">Photo</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-black" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 max-h-32 rounded-lg object-contain border border-gray-200" />
            )}
            <p className="text-[11px] text-black mt-1">JPG, PNG, WEBP or GIF, max 5MB.</p>
          </div>

          <label className="flex items-center gap-2 text-sm text-black">
            <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} className="w-4 h-4" />
            Show on public website (Pig Breeding page)
          </label>

          <button type="submit" disabled={saving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {saving ? 'Saving...' : editingId ? 'Update Animal' : 'Add Animal'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BreedingStock;
