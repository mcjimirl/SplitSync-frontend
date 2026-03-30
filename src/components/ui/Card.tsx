import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.16 }}
      className={`clay-card p-4 text-slate-900 dark:text-zinc-100 md:p-5 ${className}`}
    >
      {children}
    </motion.article>
  );
}
