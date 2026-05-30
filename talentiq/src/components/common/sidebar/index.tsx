import {
  BarChart3,
  BookOpen,
  Briefcase,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  User,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
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
    label: "Analisis Skill",
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
const Sidebar = ({
  collapsed = false,
  setCollapsed,
}: SidebarProps) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="TalentIQ"
            className="w-9 h-9 rounded-xl object-cover"
          />

          <div>
            <p className="font-bold text-[#025CB8] text-sm">
              TalentIQ-AI
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              AI Career
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#025CB8]"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${mobileOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col min-h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-40 shadow-sm transition-all duration-300 ${collapsed ? "w-[90px]" : "w-[260px]"
          }`}
      >
        {/* Header */}
        <div
          className={`border-b border-gray-100 flex items-center ${collapsed
            ? "justify-center px-2 py-5"
            : "justify-between px-5 py-5"
            }`}
        >
          <div
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3"
              }`}
          >
            <img
              src="/logo.png"
              alt="TalentIQ"
              className="w-10 h-10 rounded-xl object-cover shadow-sm"
            />

            {!collapsed && (
              <div>
                <span className="font-bold text-[#025CB8] text-base tracking-tight">
                  TalentIQ-AI
                </span>

                <span
                  className="block text-[10px] font-medium tracking-widest uppercase"
                  style={{ color: "#62AAEA" }}
                >
                  AI Career
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed?.(true)}
              className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-[#025CB8] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Expand Button */}
        {collapsed && (
          <div className="px-3 pt-3">
            <button
              onClick={() => setCollapsed?.(false)}
              className="w-full h-10 rounded-xl bg-blue-50 text-[#025CB8] flex items-center justify-center hover:bg-blue-100 transition-all"
            >
              <Menu size={18} />
            </button>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
              Menu
            </p>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm font-medium transition-all duration-200 group ${collapsed
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-3 py-2.5"
                }
                ${isActive
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:bg-blue-50 hover:text-[#025CB8]"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                    background:
                      "linear-gradient(135deg, #025CB8, #3B82C4)",
                  }
                  : {}
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* USER */}
        <div className="px-3 pb-5 space-y-3 border-t border-gray-100 pt-4">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #025CB8, #62AAEA)",
                }}
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
          ) : (
            <div className="flex justify-center">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #025CB8, #62AAEA)",
                }}
              >
                {mockUser.avatar}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              // hapus token/session jika ada
              localStorage.removeItem("token");
              sessionStorage.clear();

              // redirect ke home
              navigate("/");
            }}
            className={`flex items-center w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 ${collapsed
              ? "justify-center px-2 py-3"
              : "gap-3 px-3 py-2.5"
              }`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;