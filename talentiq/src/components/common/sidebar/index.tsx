// src/components/common/sidebar/index.tsx
import {
  BarChart3,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Map,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

// ── Mock user data ─────────────────────────────────────────────────────────────
const mockUser = {
  name: "Budi Santoso",
  role: "Data Analyst Candidate",
  avatar: "BS",
};

// ── Nav items ─────────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Roadmap Karir",
    path: "/auth/roadmap-karir",
    icon: <Map size={20} />,
  },
  {
    label: "Progress Skill",
    path: "/auth/user-analisis-skill",
    icon: <BarChart3 size={20} />,
  },
  {
    label: "Cari Lowongan",
    path: "/auth/lowongan_kerja",
    icon: <Briefcase size={20} />,
  },
  {
    label: "Profil & Kursus",
    path: "/profil",
    icon: <BookOpen size={20} />,
  },
];

// ── Sidebar Component ─────────────────────────────────────────────────────────
const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-[260px] min-h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-40 shadow-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-[#025CB8] text-base tracking-tight">
                TalentIQ
              </span>
              <span
                className="block text-[10px] font-medium tracking-widest uppercase"
                style={{ color: "#62AAEA" }}
              >
                AI Career
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:bg-blue-50 hover:text-[#025CB8]"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "linear-gradient(135deg, #025CB8, #3B82C4)" }
                  : {}
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 pb-5 space-y-3 border-t border-gray-100 pt-4">
          {/* User card */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #025CB8, #62AAEA)" }}
            >
              {mockUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {mockUser.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {mockUser.role}
              </p>
            </div>
            <button className="p-1 rounded-lg hover:bg-blue-100 transition-colors">
              <User size={14} className="text-[#025CB8]" />
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                ${isActive ? "text-[#025CB8]" : "text-gray-400"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-blue-100" : ""
                      }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[9px] font-medium leading-tight text-center">
                    {item.label.split(" ")[0]}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
