import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import HeroTicker from "../components/marketing/HeroTicker";
import PublicNav from "../components/marketing/PublicNav";
import { useTheme } from "../features/theme/ThemeContext";

/** Moody gym photography — replace with your own asset in `/public` if you prefer */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80";

export default function LandingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const shell = isDark
    ? "bg-neutral-950 text-white"
    : "bg-zinc-100 text-slate-900";

  const heroOverlay = isDark
    ? "bg-gradient-to-b from-black/55 via-black/65 to-neutral-950"
    : "bg-gradient-to-b from-white/75 via-zinc-200/85 to-zinc-100";

  const headline = isDark ? "text-white" : "text-slate-900";
  const sub = isDark ? "text-white/85" : "text-slate-700";
  const cta = isDark
    ? "bg-white pl-8 pr-2 py-2 text-neutral-950 shadow-black/30 hover:bg-zinc-100"
    : "bg-slate-900 pl-8 pr-2 py-2 text-white shadow-slate-900/25 hover:bg-slate-800";
  const ctaCircle = isDark ? "bg-neutral-950 text-white group-hover:bg-neutral-800" : "bg-white text-slate-900 group-hover:bg-zinc-100";
  const chevron = isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-800";

  const sectionMuted = isDark ? "text-white/45" : "text-slate-500";
  const sectionTitle = isDark ? "text-white" : "text-slate-900";
  const sectionBody = isDark ? "text-zinc-400" : "text-slate-600";
  const sectionBorder = isDark ? "border-white/10" : "border-slate-200";
  const storyBg = isDark ? "bg-black" : "bg-zinc-50";
  const quote = isDark ? "text-zinc-300" : "text-slate-700";
  const attribution = isDark ? "text-zinc-500" : "text-slate-500";
  const pricingBtn = isDark
    ? "bg-white text-neutral-950 hover:bg-zinc-100"
    : "bg-slate-900 text-white hover:bg-slate-800";
  const footerBg = isDark ? "border-white/10 bg-black text-zinc-600" : "border-slate-200 bg-white text-slate-500";

  return (
    <div className={`public-marketing min-h-screen font-[Inter,system-ui,sans-serif] antialiased ${shell}`}>
      <PublicNav variant="landing" />

      <section className="relative flex min-h-svh flex-col pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className={`absolute inset-0 ${heroOverlay}`} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-36 pt-10 text-center sm:px-6 md:pb-44">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <h1 className={`text-4xl font-extralight uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${headline}`}>
              <span className="block">Find your</span>
              <span className="mt-1 block font-black tracking-tighter">power</span>
            </h1>
            <p className={`mx-auto mt-8 max-w-2xl text-sm font-light leading-relaxed sm:text-base md:text-lg ${sub}`}>
              Training designed for real life — not intimidation. Move at your own pace, build confidence step by step,
              and create strength that lasts.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/signup"
                className={`group inline-flex items-center gap-3 rounded-full pl-8 pr-2 py-2 text-sm font-bold uppercase tracking-[0.15em] shadow-lg transition sm:pl-10 sm:text-base ${cta}`}
              >
                <span>Get started</span>
                <span className={`grid h-10 w-10 place-items-center rounded-full transition ${ctaCircle}`}>
                  <span className="text-lg leading-none" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </div>
          </motion.div>

          <a
            href="#philosophy"
            className={`absolute bottom-28 left-1/2 z-2 -translate-x-1/2 transition md:bottom-32 ${chevron}`}
            aria-label="Scroll to content"
          >
            <FiChevronDown className="h-8 w-8 animate-bounce" strokeWidth={1.25} />
          </a>
        </div>

        <div className="relative z-20 mt-auto w-full">
          <HeroTicker theme={theme} />
        </div>
      </section>

      <section
        id="philosophy"
        className={`scroll-mt-20 border-t px-4 py-20 sm:px-6 lg:px-8 ${isDark ? "bg-neutral-950" : "bg-white"} ${sectionBorder}`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.35em] ${sectionMuted}`}>Philosophy</p>
          <h2 className={`mt-4 text-2xl font-bold uppercase tracking-tight sm:text-3xl ${sectionTitle}`}>
            Built for consistency
          </h2>
          <p className={`mt-4 text-sm leading-relaxed sm:text-base ${sectionBody}`}>
            SplitSync turns your profile into weekly splits you can actually follow — clear structure, attendance you can
            trust, and guides when you need a refresher. No noise, just training.
          </p>
        </div>
      </section>

      <section id="stories" className={`scroll-mt-20 border-t px-4 py-20 sm:px-6 lg:px-8 ${storyBg} ${sectionBorder}`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.35em] ${sectionMuted}`}>Stories</p>
          <blockquote className={`mt-6 text-lg font-light italic leading-relaxed sm:text-xl ${quote}`}>
            &ldquo;I stopped guessing what to do each day. The plan holds me accountable without burning me out.&rdquo;
          </blockquote>
          <p className={`mt-4 text-xs uppercase tracking-widest ${attribution}`}>— SplitSync athlete</p>
        </div>
      </section>

      <section
        id="pricing"
        className={`scroll-mt-20 border-t px-4 py-20 sm:px-6 lg:px-8 ${isDark ? "bg-neutral-950" : "bg-zinc-100"} ${sectionBorder}`}
      >
        <div className="mx-auto max-w-lg text-center">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.35em] ${sectionMuted}`}>Start</p>
          <h2 className={`mt-4 text-2xl font-bold uppercase tracking-tight sm:text-3xl ${sectionTitle}`}>
            Train on your terms
          </h2>
          <p className={`mt-3 text-sm ${sectionBody}`}>Create a free account and generate your first split in minutes.</p>
          <Link
            to="/signup"
            className={`mt-8 inline-flex rounded-full px-10 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition ${pricingBtn}`}
          >
            Sign up now
          </Link>
        </div>
      </section>

      <footer className={`border-t px-4 py-8 text-center text-[10px] uppercase tracking-[0.25em] ${footerBg}`}>
        © {new Date().getFullYear()} SplitSync
      </footer>
    </div>
  );
}
