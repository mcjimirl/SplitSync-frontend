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
    return isActive
      ? "flex items-center gap-3 rounded-2xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white shadow-md dark:bg-white dark:text-neutral-950"
      : "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white";
  }

  function iconWrapClass(isActive: boolean) {
    return isActive
      ? "grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/15 text-base dark:bg-neutral-950/10"
      : "grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-200/80 text-base dark:bg-white/5";
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
              className="fixed left-0 top-0 z-[70] flex h-full w-[min(280px,88vw)] flex-col rounded-r-[28px] border border-slate-200/80 bg-white px-3 py-5 text-slate-900 shadow-2xl dark:border-transparent dark:bg-slate-950 dark:text-white"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <div className="mb-6 flex items-center justify-between gap-2 px-2">
                <Link to="/app" onClick={close} className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-amber-400 dark:text-slate-950 dark:shadow-amber-500/30">
                    <FiZap className="text-xl" />
                  </span>
                  <span className="text-xl font-semibold tracking-tight">SplitSync</span>
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15 dark:hover:text-white"
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
                    {({ isActive }) => (
                      <>
                        <span className={iconWrapClass(isActive)}>
                          <item.icon />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
                {adminItems.map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={close} className={({ isActive }) => linkClass(isActive)}>
                    {({ isActive }) => (
                      <>
                        <span className={iconWrapClass(isActive)}>
                          <item.icon />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-4 space-y-1 border-t border-slate-200 pt-4 dark:border-white/10">
                <NavLink to="/app/settings" onClick={close} className={({ isActive }) => linkClass(isActive)}>
                  {({ isActive }) => (
                    <>
                      <span className={iconWrapClass(isActive)}>
                        <FiSettings />
                      </span>
                      Settings
                    </>
                  )}
                </NavLink>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-100 text-base dark:bg-rose-500/15">
                    <FiLogOut />
                  </span>
                  Logout
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-3 text-center dark:border-white/10 dark:bg-white/5">
                <p className="text-xs text-slate-500 dark:text-zinc-500">Signed in</p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-zinc-200">
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
