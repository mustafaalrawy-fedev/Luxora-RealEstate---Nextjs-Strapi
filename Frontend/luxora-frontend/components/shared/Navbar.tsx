"use client";

import { NavigationLinks } from "../ui/navigation-links";
import { ModeToggle } from "./theme-toggle";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AuthBtnLoading } from "./LoadingState";
import { Menu, X, LogOut, LayoutDashboard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ─── Bug fixes vs original ────────────────────────────────────────────────────
// 1. Removed useMenuBarStore — the store's isMenuOpen was never connected to
//    the shadcn <Sheet>, so open/close state was completely detached from the UI.
//    Replaced with local useState which actually controls the drawer.
// 2. Replaced <Sheet> with a custom framer-motion drawer so we can:
//    - Control width per breakpoint (full on mobile, 380px on md+)
//    - Add proper entry/exit animations
//    - Apply a backdrop overlay
// 3. Body scroll is locked while the drawer is open.
// ─────────────────────────────────────────────────────────────────────────────

const Header = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const dashboardLink = "/agent";

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close drawer on route change / resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <nav className="flex justify-center items-center container-space h-20 fixed top-0 left-0 right-0 bg-background/20 backdrop-blur-sm z-50 border-b border-white/10">
        {/* Desktop */}
        <div className="hidden lg:flex w-full">
          <DesktopNav
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            dashboardLink={dashboardLink}
            router={router}
          />
        </div>

        {/* Mobile / Tablet */}
        <div className="flex lg:hidden w-full justify-between items-center">
          <Logo />
          <div className="flex items-center gap-3">
            <ModeToggle />
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer panel
                - Mobile (< md): full width
                - md and above: fixed 380px from the right  */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.8,
              }}
              className={[
                "fixed top-0 right-0 bottom-0 z-[70] lg:hidden",
                "w-full md:w-[380px]",            // ← full on mobile, 380px on md+
                "bg-background/95 backdrop-blur-xl",
                "border-l border-white/10",
                "flex flex-col",
                "shadow-2xl shadow-black/40",
              ].join(" ")}
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/10 flex-shrink-0">
                <Logo />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-5">
                  Navigation
                </p>

                {/* Staggered link animation */}
                <motion.div
                  className="flex flex-col gap-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                  }}
                >
                  <NavigationLinks
                    className="flex-col items-start gap-5 w-full"
                    // itemClassName="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all group"
                    // motionVariants={{
                    //   hidden: { opacity: 0, x: 20 },
                    //   visible: { opacity: 1, x: 0 },
                    // }}
                    setIsOpen={setIsOpen}
                  />
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-white/10 my-8" />

                {/* Auth section */}
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-5">
                  Account
                </p>

                <motion.div
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  {isLoading ? (
                    <AuthBtnLoading />
                  ) : isAuthenticated ? (
                    <>
                      <button
                        onClick={() => { setIsOpen(false); router.push(dashboardLink); }}
                        className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all group"
                      >
                        <span className="flex items-center gap-3 font-medium">
                          <LayoutDashboard size={18} />
                          Dashboard
                        </span>
                        <ChevronRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all font-medium"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => { setIsOpen(false); router.push("/login"); }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => { setIsOpen(false); router.push("/register"); }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-white/10 shrink-0">
                <p className="text-xs text-white/20 text-center tracking-wide">
                  © 2026 Real Estate Platform
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

// ── Desktop nav (unchanged logic, kept clean) ──────────────────────────────
function DesktopNav({
  isAuthenticated,
  isLoading,
  dashboardLink,
  router,
}: {
  isAuthenticated: boolean;
  isLoading: boolean;
  dashboardLink: string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex justify-between items-center w-full">
      <Logo />

      <div className="flex items-center gap-10">
        <NavigationLinks className="gap-8" />
        <ModeToggle />
      </div>

      <div className="flex items-center gap-3">
        {isLoading ? (
          <AuthBtnLoading />
        ) : isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-transparent border border-white/20 text-white hover:bg-white/10"
              onClick={() => router.push(dashboardLink)}
            >
              <LayoutDashboard size={16} className="mr-2" />
              Dashboard
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut size={14} className="mr-1.5" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              // className=""
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}