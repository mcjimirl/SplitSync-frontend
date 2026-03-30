import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SummaryPanel from "./SummaryPanel.tsx";
import { SidebarProvider } from "./SidebarContext";
import TopBar from "./TopBar";

export default function AppShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-zinc-100 text-slate-900 dark:bg-neutral-950 dark:text-zinc-100">
        <div className="mx-auto min-h-screen max-w-[1400px] p-3 md:p-6">
          <Navbar />
          <div className="app-frame min-h-[92vh] overflow-hidden rounded-[28px] p-3 md:p-5">
            <TopBar />
            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_300px]">
              <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="min-w-0 space-y-4"
              >
                <Outlet />
              </motion.main>
              <div className="hidden min-w-0 xl:block">
                <SummaryPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
