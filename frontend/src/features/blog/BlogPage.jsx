import React, { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getAssetUrl } from '../../utils/format';

const emptyForm = { title: '', category: 'General', excerpt: '', content: '', status: 'draft' };

const BlogAdminPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
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
      const { data } = await api.get('/blog');
      setPosts(data);
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

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    resetImage();
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setForm({
      title: post.title,
      category: post.category || 'General',
      excerpt: post.excerpt || '',
      content: post.content,
      status: post.status,
    });
    setEditingId(post.id);
    resetImage();
    setImagePreview(post.imageUrl ? getAssetUrl(post.imageUrl) : null);
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      // multipart/form-data because we may be sending an image file
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('excerpt', form.excerpt);
      fd.append('content', form.content);
      fd.append('status', form.status);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/blog/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/blog', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filteredPosts = posts.filter((post) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      post.title?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Blog</h1>
          <p className="text-black text-base mt-1">Write and manage the blog posts shown on the public website.</p>
        </div>
        <button onClick={openCreate} className="bg-dalfam-green text-white px-4 py-2 rounded-lg font-medium hover:bg-dalfam-dark">
          + New Post
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or category..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-black">Loading...</p>}
        {!loading && filteredPosts.length === 0 && <p className="text-black">No posts yet.</p>}
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            {post.imageUrl ? (
              <div className="h-36 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={getAssetUrl(post.imageUrl)} alt={post.title} className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="h-36 w-full bg-gray-100 flex items-center justify-center text-black text-sm">No image</div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wide font-semibold text-black">{post.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-black ${post.status === 'published' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-black leading-snug">{post.title}</h3>
              <p className="text-sm text-black mt-1 flex-1 line-clamp-3">{post.excerpt}</p>
              <p className="text-xs text-black mt-3">{formatDate(post.publishedAt || post.createdAt)}</p>
              <div className="mt-4 flex gap-3 text-sm">
                <button onClick={() => openEdit(post)} className="text-black underline">Edit</button>
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(post.id)} className="text-black underline">Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Post' : 'New Blog Post'}>
        <form onSubmit={handleSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Title *</label>
            <input name="title" required value={form.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="General">General</option>
                <option value="Pig Breeding">Pig Breeding</option>
                <option value="Tourism">Tourism</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
                <option value="draft">Draft (not shown to the public)</option>
                <option value="published">Published (visible on the website)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-1">Short excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-1">Full content *</label>
            <textarea name="content" required value={form.content} onChange={handleChange} rows={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-1">Cover image</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-black" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 max-h-32 rounded-lg object-contain border border-gray-200" />
            )}
            <p className="text-[11px] text-black mt-1">JPG, PNG, WEBP or GIF, max 5MB.</p>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {saving ? 'Saving...' : editingId ? 'Update Post' : 'Publish / Save'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BlogAdminPage;
