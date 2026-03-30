import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="clay-card w-full p-6 md:p-10"
      >
        <p className="text-sm font-medium text-slate-500">Welcome to SplitSync</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Gym Split Generator & Workout Scheduler
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Build personalized weekly splits, organize your training calendar, and track progress with a clean modern dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/login">
            <Button>Log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="neutral">Sign up</Button>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
