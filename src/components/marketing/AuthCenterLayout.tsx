import type { ReactNode } from "react";
import PublicNav from "./PublicNav";
import { useTheme } from "../../features/theme/ThemeContext";

const DEFAULT_BACKDROP =
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8e?auto=format&fit=crop&w=1920&q=85";

type AuthCenterLayoutProps = {
  children: ReactNode;
  /** Set false for a flat dark background only */
  backdropImage?: string | false;
};

export default function AuthCenterLayout({ children, backdropImage = DEFAULT_BACKDROP }: AuthCenterLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const shell = isDark ? "bg-neutral-950 text-white" : "bg-zinc-100 text-slate-900";

  const overlayMain = isDark
    ? "bg-gradient-to-b from-black/45 via-neutral-950/80 to-neutral-950"
    : "bg-gradient-to-b from-white/55 via-zinc-100/88 to-zinc-100";

  const overlayRadial = isDark
    ? "bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]"
    : "bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(255,255,255,0.5),transparent_55%)]";

  const flatBg = isDark
    ? "bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(255,255,255,0.06),transparent_55%)]"
    : "bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(15,23,42,0.06),transparent_55%)]";

  return (
    <div className={`public-marketing relative min-h-screen overflow-x-hidden font-[Inter,system-ui,sans-serif] antialiased ${shell}`}>
      <PublicNav variant="auth" />

      {backdropImage ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 bottom-0 top-16 z-0 bg-cover bg-center bg-no-repeat grayscale contrast-[1.05]"
            style={{ backgroundImage: `url("${backdropImage}")` }}
          />
          <div aria-hidden className={`fixed inset-x-0 bottom-0 top-16 z-1 ${overlayMain}`} />
          <div aria-hidden className={`fixed inset-x-0 bottom-0 top-16 z-1 ${overlayRadial}`} />
        </>
      ) : (
        <div aria-hidden className={`fixed inset-x-0 bottom-0 top-16 z-0 ${flatBg}`} />
      )}

      <main className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-[440px]">{children}</div>
      </main>
    </div>
  );
}
