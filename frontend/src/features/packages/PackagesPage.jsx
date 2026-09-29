import React, { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, getAssetUrl } from '../../utils/format';

const emptyForm = {
  name: '', description: '', category: 'nature', durationDays: 1, price: '',
  maxGuests: 10, status: 'active', isPublic: false,
};

const Packages = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
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
      const { data } = await api.get('/packages');
      setPackages(data);
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
  const openEdit = (pkg) => {
    setForm({
      name: pkg.name, description: pkg.description || '', category: pkg.category,
      durationDays: pkg.durationDays, price: pkg.price, maxGuests: pkg.maxGuests,
      status: pkg.status, isPublic: !!pkg.isPublic,
    });
    setEditingId(pkg.id);
    resetImage();
    setImagePreview(pkg.imageUrl ? getAssetUrl(pkg.imageUrl) : null);
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
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('durationDays', form.durationDays);
      fd.append('price', form.price);
      fd.append('maxGuests', form.maxGuests);
      fd.append('status', form.status);
      fd.append('isPublic', form.isPublic);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/packages/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/packages', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tourism package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filteredPackages = packages.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Tourism Packages</h1>
        </div>
        <button onClick={openCreate} className="bg-dalfam-green text-white px-4 py-2 rounded-lg font-medium hover:bg-dalfam-dark">
          + New Package
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or category..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-black">Loading...</p>}
        {!loading && filteredPackages.length === 0 && <p className="text-black">No tourism packages yet.</p>}
        {filteredPackages.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            {p.imageUrl ? (
              <img src={getAssetUrl(p.imageUrl)} alt={p.name} className="w-full h-36 object-cover" />
            ) : (
              <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-xs text-black">No photo</div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wide font-semibold text-black">{p.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-black ${p.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>{p.status}</span>
              </div>
              <h3 className="text-lg font-bold text-black">{p.name}</h3>
              <p className="text-sm text-black mt-1 flex-1">{p.description}</p>
              <div className="mt-3 text-sm text-black space-y-1">
                <p>⏱ {p.durationDays} day(s)</p>
                <p>👥 Up to {p.maxGuests} guests</p>
                <p className="text-black font-semibold">{formatCurrency(p.price)}</p>
              </div>
              <div className="mt-2">
                {p.isPublic ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-dalfam-gold/20 text-black">On website</span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-black">Hidden</span>
                )}
              </div>
              <div className="mt-4 flex gap-3 text-sm">
                <button onClick={() => openEdit(p)} className="text-black underline">Edit</button>
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(p.id)} className="text-black underline">Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Package' : 'New Tourism Package'}>
        <form onSubmit={handleSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Package Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="nature">Nature</option>
                <option value="cultural">Cultural</option>
                <option value="corporate">Corporate</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Duration (days)</label>
              <input type="number" min="1" name="durationDays" value={form.durationDays} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Price (TZS) *</label>
              <input type="number" min="0" name="price" required value={form.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Max Guests</label>
              <input type="number" min="1" name="maxGuests" value={form.maxGuests} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
            </div>
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
            Show on public website (Tourism page)
          </label>

          <button type="submit" disabled={saving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {saving ? 'Saving...' : editingId ? 'Update Package' : 'Create Package'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Packages;
