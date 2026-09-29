import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const emptyForm = { name: '', email: '', password: '', role: 'staff' };
const emptyEditForm = { name: '', email: '', role: 'staff' };
const emptyPasswordForm = { newPassword: '', confirmPassword: '' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create user
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Edit user
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editSaving, setEditSaving] = useState(false);

  // Reset password
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/auth/register', form);
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (u) => {
    try {
      await api.patch(`/auth/users/${u.id}/status`, { isActive: !u.isActive });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  // --- Edit user ---
  const openEdit = (u) => {
    setEditingUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditSaving(true);
    try {
      await api.put(`/auth/users/${editingUser.id}`, editForm);
      setEditModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    } finally {
      setEditSaving(false);
    }
  };

  // --- Reset password ---
  const openResetPassword = (u) => {
    setPasswordUser(u);
    setPasswordForm(emptyPasswordForm);
    setPasswordModalOpen(true);
  };

  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordUser) return;
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setPasswordSaving(true);
    try {
      await api.put(`/auth/users/${passwordUser.id}/reset-password`, {
        newPassword: passwordForm.newPassword,
      });
      setPasswordModalOpen(false);
      alert('Password reset successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">User Management</h1>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-dalfam-green text-white px-4 py-2 rounded-lg font-medium hover:bg-dalfam-dark">
          + Add User
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or role..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
      </div>

      <div className="rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gray-50 text-black text-left">
            <tr>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Role</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-black">Loading...</td></tr>}
            {!loading && filteredUsers.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-black">No users found.</td></tr>
            )}
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-black">{u.name}</td>
                <td className="px-4 py-3 text-black">{u.email}</td>
                <td className="px-4 py-3 capitalize text-black">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-black ${u.isActive ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => openEdit(u)} className="text-black underline">Edit</button>
                  <button onClick={() => openResetPassword(u)} className="text-black underline">Reset Password</button>
                  <button onClick={() => toggleStatus(u)} className="text-black underline">
                    {u.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create user */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff / Admin User">
        <form onSubmit={handleSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Full Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Email *</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Password *</label>
            <input type="password" name="password" required value={form.password} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {saving ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </Modal>

      {/* Edit user */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit ${editingUser?.name || 'User'}`}>
        <form onSubmit={handleEditSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Full Name *</label>
            <input name="name" required value={editForm.name} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Email *</label>
            <input type="email" name="email" required value={editForm.email} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Role</label>
            <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={editSaving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {editSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* Reset password */}
      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} title={`Reset Password — ${passwordUser?.name || ''}`}>
        <form onSubmit={handlePasswordSubmit} className="space-y-3 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div>
            <label className="block text-xs font-medium text-black mb-1">New Password *</label>
            <input type="password" name="newPassword" required minLength={6} value={passwordForm.newPassword} onChange={handlePasswordChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-black mb-1">Confirm New Password *</label>
            <input type="password" name="confirmPassword" required minLength={6} value={passwordForm.confirmPassword} onChange={handlePasswordChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black" />
          </div>
          <button type="submit" disabled={passwordSaving} className="w-full bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark disabled:opacity-60">
            {passwordSaving ? 'Saving...' : 'Reset Password'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
