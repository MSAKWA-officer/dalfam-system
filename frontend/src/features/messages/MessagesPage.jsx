import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const statusColor = {
  new: 'bg-yellow-100 text-black',
  read: 'bg-blue-100 text-black',
  replied: 'bg-green-100 text-black',
};

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact', { params: filter ? { status: filter } : {} });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const openMessage = async (m) => {
    setActive(m);
    setModalOpen(true);
    // Mark as read the moment an admin opens a "new" message
    if (m.status === 'new') {
      try {
        const res = await api.put(`/contact/${m.id}`, { status: 'read' });
        setActive(res.data);
        setMessages((prev) => prev.map((x) => (x.id === m.id ? res.data : x)));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const markReplied = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const res = await api.put(`/contact/${active.id}`, { status: 'replied' });
      setActive(res.data);
      setMessages((prev) => prev.map((x) => (x.id === active.id ? res.data : x)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update message');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filteredMessages = messages.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Messages</h1>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-dalfam-gold"
        />
      </div>

      <div className="rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gray-50 text-black text-left">
            <tr>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Phone</th>
              <th className="px-4 py-3 font-bold">Received</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-black">Loading...</td></tr>}
            {!loading && filteredMessages.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-black">No messages yet.</td></tr>
            )}
            {filteredMessages.map((m) => (
              <tr key={m.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-black">{m.name}</td>
                <td className="px-4 py-3 text-black">{m.email}</td>
                <td className="px-4 py-3 text-black">{m.phone || '—'}</td>
                <td className="px-4 py-3 text-black">{new Date(m.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor[m.status] || ''}`}>{m.status}</span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openMessage(m)} className="text-black underline">View</button>
                  <button onClick={() => handleDelete(m.id)} className="text-black underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={active?.name || 'Message'}>
        {active && (
          <div className="space-y-4 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <div className="text-sm">
              <p><span className="font-medium text-black">Email:</span> {active.email}</p>
              {active.phone && <p><span className="font-medium text-black">Phone:</span> {active.phone}</p>}
              <p><span className="font-medium text-black">Received:</span> {new Date(active.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium text-black text-sm mb-1">Message</p>
              <p className="text-black text-sm whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border border-gray-100">
                {active.message}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${active.email}`}
                className="flex-1 text-center bg-dalfam-green text-white font-semibold py-2.5 rounded-lg hover:bg-dalfam-dark"
              >
                Reply by Email
              </a>
              {active.status !== 'replied' && (
                <button
                  onClick={markReplied}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Mark as Replied'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MessagesPage;
