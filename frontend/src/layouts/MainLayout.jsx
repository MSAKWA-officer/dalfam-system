import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Each module is a group in the sidebar. "to" on the module itself means it's
// a direct link (no submodules); otherwise "children" holds the submodules.
const modules = [
  { key: 'dashboard', label: 'Dashboard', icon: '', to: '/app/dashboard' },
  {
    key: 'pig-breeding',
    label: 'Pig Breeding',
    icon: '',
    children: [
      { to: '/app/breeding-stock', label: 'Breeding Stock', icon: '' },
      { to: '/app/litters', label: 'Litters', icon: '' },
      { to: '/app/health-records', label: 'Health Records', icon: '💉' },
    ],
  },
  {
    key: 'tourism',
    label: 'Tourism',
    icon: '',
    children: [
      { to: '/app/packages', label: 'Tourism Packages', icon: '' },
      { to: '/app/bookings', label: 'Bookings', icon: '' },
    ],
  },
  {
    key: 'website',
    label: 'Website',
    icon: '',
    children: [
      { to: '/app/messages', label: 'Messages', icon: '' },
      { to: '/app/blog', label: 'Blog', icon: '' },
    ],
  },
];

const userModule = {
  key: 'user',
  label: 'User',
  icon: '',
  children: [
    { to: '/app/users', label: 'User Management', icon: '' },
  ],
};

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-dalfam-gold text-dalfam-dark' : 'text-gray-200 hover:bg-white/10'
  }`;

const subLinkClasses = ({ isActive }) =>
  `flex items-center gap-3 pl-11 pr-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-dalfam-gold text-dalfam-dark' : 'text-gray-300 hover:bg-white/10'
  }`;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allModules = user?.role === 'admin' ? [...modules, userModule] : modules;

  // Expand whichever module contains the currently active route by default.
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    allModules.forEach((m) => {
      if (m.children) {
        initial[m.key] = m.children.some((c) => location.pathname.startsWith(c.to));
      }
    });
    return initial;
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="h-screen flex bg-dalfam-cream overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full md:h-screen w-64 bg-dalfam-dark text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto shrink-0`}>
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-xl font-bold tracking-wide text-dalfam-gold">DALFAM</p>
          <p className="text-xs text-gray-300">Together for a Greater Tomorrow</p>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3 pb-6">
          {allModules.map((mod) => {
            // Standalone module (no submodules) — render as a direct link.
            if (mod.to) {
              return (
                <NavLink key={mod.key} to={mod.to} onClick={() => setSidebarOpen(false)} className={linkClasses}>
                  <span>{mod.icon}</span>
                  {mod.label}
                </NavLink>
              );
            }

            const isOpen = !!openGroups[mod.key];
            const hasActiveChild = mod.children.some((c) => location.pathname.startsWith(c.to));

            return (
              <div key={mod.key}>
                <button
                  type="button"
                  onClick={() => toggleGroup(mod.key)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    hasActiveChild ? 'text-dalfam-gold' : 'text-gray-100 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span>{mod.icon}</span>
                    {mod.label}
                  </span>
                  <span className={`transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}>›</span>
                </button>
                {isOpen && (
                  <div className="mt-1 flex flex-col gap-1">
                    {mod.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={() => setSidebarOpen(false)}
                        className={subLinkClasses}
                      >
                        <span>{child.icon}</span>
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="shrink-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-dalfam-dark">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
