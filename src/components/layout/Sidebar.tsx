import { Link, useLocation } from 'react-router-dom';
import { X, Home, Clipboard, BarChart, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/inspection', icon: <Clipboard size={20} />, label: 'Inspection' },
    { path: '/reports', icon: <BarChart size={20} />, label: 'Reports' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <span className="text-lg font-semibold text-hpe-blue-700">HPE Walkthrough</span>
              <button
                type="button"
                className="p-2 rounded-md text-hpe-blue-500 hover:bg-gray-100"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="mt-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium ${
                        isActive(item.path)
                          ? 'text-hpe-green-500 bg-hpe-green-50'
                          : 'text-hpe-blue-500 hover:bg-gray-50'
                      }`}
                      onClick={onClose}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-sm">
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-hpe-green-500 bg-hpe-green-50'
                      : 'text-hpe-blue-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;