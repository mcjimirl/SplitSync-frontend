import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiActivity,
  FiCoffee,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiSettings,
  FiShield,
  FiTarget,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "../../features/auth/AuthContext";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useSidebar } from "./SidebarContext";

const navItems = [
  { to: "/app", label: "Dashboard", icon: FiGrid },
  { to: "/app/generate", label: "Generate Plan", icon: FiTarget },
  { to: "/app/attendance", label: "Attendance", icon: FiActivity },
  { to: "/app/guides", label: "Exercise Guides", icon: FiLayers },
  { to: "/app/diet", label: "Diet", icon: FiCoffee },
  { to: "/app/profile", label: "Profile", icon: FiUser },
] as const;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { open, close } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const adminItems =
    user?.role === "SUPER_ADMIN"
      ? [{ to: "/app/admin" as const, label: "Admin", icon: FiShield }]
      : [];

  function linkClass(isActive: boolean) {
    return `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
      isActive ? "bg-white/15 text-white shadow-inner" : "text-zinc-400 hover:bg-white/10 hover:text-white"
    }`;
  }

  return (
    <>
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] md:bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="navigation"
            aria-label="Main navigation"
            className="fixed left-0 top-0 z-[70] flex h-full w-[min(280px,88vw)] flex-col rounded-r-[28px] bg-slate-950 px-3 py-5 text-white shadow-2xl shadow-black/40"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="mb-6 flex items-center justify-between gap-2 px-2">
              <Link to="/app" onClick={close} className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/30">
                  <FiZap className="text-xl" />
                </span>
                <span className="text-xl font-semibold tracking-tight">SplitSync</span>
              </Link>
              <button
                type="button"
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-zinc-300 transition hover:bg-white/15 hover:text-white"
                aria-label="Close sidebar"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/app"}
                  onClick={close}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-base">
                    <item.icon />
                  </span>
                  {item.label}
                </NavLink>
              ))}
              {adminItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={close} className={({ isActive }) => linkClass(isActive)}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-base">
                    <item.icon />
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
              <NavLink to="/app/settings" onClick={close} className={({ isActive }) => linkClass(isActive)}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-base">
                  <FiSettings />
                </span>
                Settings
              </NavLink>
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-500/15 text-base">
                  <FiLogOut />
                </span>
                Logout
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 p-3 text-center">
              <p className="text-xs text-zinc-500">Signed in</p>
              <p className="mt-1 truncate text-sm font-semibold text-zinc-200">
                {user?.firstName ?? user?.name ?? "User"}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
      <Modal
        open={showLogoutModal}
        title="Confirm Logout"
        onClose={() => setShowLogoutModal(false)}
        actions={
          <>
            <Button variant="neutral" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLogoutModal(false);
                close();
                logout();
              }}
            >
              Logout
            </Button>
          </>
        }
      >
        Are you sure you want to log out?
      </Modal>
    </>
  );
}
