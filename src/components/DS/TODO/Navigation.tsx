"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { cn } from "@lib/utils";
type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
  hidden?: boolean;
};

const leftNavItems: NavItem[] = [
  { label: "PROJECT", href: "/" },
  { label: "LORE", href: "#", disabled: true },
  { label: "GALAXIES", href: "#", disabled: true, hidden: true },
];

const rightNavItems: NavItem[] = [
  { label: "CONTRIBUTE", href: "/contribute" },
  { label: "ROAD MAP", href: "/roadmap", hidden: true },
  { label: "SERVERS STATUS", href: "#", disabled: true },
  { label: "FORUM", href: "#", disabled: true },
];

function buildLinkClasses(isActive: boolean, isDisabled?: boolean) {
  const base =
    "uppercase text-[0.58rem] tracking-[0.42em] px-5 py-2 rounded-none transition-all duration-300 font-semibold font-poppins border";

  if (isDisabled) {
    return cn(
      base,
      "border-brand-primary/40 text-brand-primary/40 cursor-not-allowed",
    );
  }

  if (isActive) {
    return cn(
      base,
      "border-brand-primary bg-brand-primary text-brand-dark shadow-[0_0_18px_rgba(var(--brand-primary-rgb),0.35)]",
    );
  }

  return cn(
    base,
    "border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary hover:text-brand-dark",
  );
}

export default function Navigation() {
  // const { user, logout, isAuthenticated } = useSimpleAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navGroupClasses = cn(
    "flex items-center gap-2 px-6 py-3 rounded-none border backdrop-blur-xl font-poppins",
    "border-brand-primary/40 bg-brand-dark/90 shadow-[0_0_35px_rgba(var(--brand-dark-rgb),0.45)]",
  );

  const isItemActive = (item: NavItem) => {
    if (item.disabled || item.href === "#") {
      return false;
    }

    if (item.href === "/") {
      return pathname === "/" || pathname === "/home";
    }

    return pathname.startsWith(item.href);
  };

  // const handleLogout = () => {
  //   // void logout();
  // };

  const renderNavItem = (item: NavItem) => {
    if (item.hidden) {
      return null;
    }

    const isActive = isItemActive(item);
    const classes = buildLinkClasses(isActive, item.disabled);

    if (item.disabled || item.href === "#") {
      return (
        <span key={item.label} className={classes}>
          {item.label}
        </span>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={classes}
        onClick={() => setIsOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  const renderLogo = (className?: string) => (
    <Link
      href="/"
      className={`flex items-center justify-center ${className ?? ""}`.trim()}
      onClick={() => setIsOpen(false)}
      aria-label="Retour à l'accueil"
    >
      <Image
        src="/dyingstar-logo.png"
        alt="Dying Star"
        width={200}
        height={41}
        priority
        sizes="(max-width: 767px) 150px, 220px"
        className="h-10 w-auto"
      />
    </Link>
  );

  return (
    <nav className="border-brand-primary/40 bg-brand-dark fixed top-0 right-0 left-0 z-50 border-b shadow-[0_10px_30px_rgba(var(--brand-dark-rgb),0.65)]">
      <div className="bg-brand-primary pointer-events-none absolute inset-x-0 top-0 h-[2px]" />
      <div className="bg-brand-primary/30 pointer-events-none absolute inset-x-0 bottom-0 h-[1px]" />
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative flex h-20 items-center md:hidden">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-brand-primary relative z-10 transition-colors hover:text-white"
              aria-label="Ouvrir le menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {renderLogo(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            )}

            <div className="relative z-10 ml-auto flex items-center gap-2">
              {/* {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="text-brand-primary font-poppins flex items-center gap-1 text-xs tracking-[0.25em] uppercase transition-colors hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    {user?.username}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Se déconnecter"
                    className="border-brand-primary/60 text-brand-primary hover:bg-brand-primary hover:text-brand-dark flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : ( */}
              <Link
                href="/login"
                className="text-brand-primary font-poppins text-[0.65rem] tracking-[0.3em] uppercase hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              {/* )} */}
              <span role="img" aria-label="Français" className="text-lg">
                🇫🇷
              </span>
            </div>
          </div>

          <div className="hidden h-20 items-center gap-6 md:grid md:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center justify-end">
              <div className={navGroupClasses}>
                {leftNavItems
                  .filter((item) => !item.hidden)
                  .map((item) => renderNavItem(item))}
              </div>
            </div>

            {renderLogo("mx-auto md:justify-self-center")}
            <div className="flex items-center justify-end gap-6">
              <div className={navGroupClasses}>
                {rightNavItems
                  .filter((item) => !item.hidden)
                  .map((item) => renderNavItem(item))}
              </div>
              <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase">
                {/* {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/profile"
                      className="text-brand-primary font-poppins flex items-center gap-2 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      {user?.username}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      aria-label="Se déconnecter"
                      className="border-brand-primary/60 text-brand-primary hover:bg-brand-primary hover:text-brand-dark flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : ( */}
                <Link href="/login" className={buildLinkClasses(false)}>
                  LOGIN
                </Link>
                {/* )} */}
                <span role="img" aria-label="Français" className="text-xl">
                  🇫🇷
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-brand-primary/30 bg-brand-dark/95 border-t backdrop-blur-xl md:hidden">
          <div className="space-y-3 px-4 py-4">
            {[...leftNavItems, ...rightNavItems]
              .filter((item) => !item.hidden)
              .map((item) => {
                const isActive = isItemActive(item);
                const base =
                  "block px-4 py-3 rounded-none border uppercase text-xs tracking-[0.35em] font-poppins transition-colors duration-300";

                if (item.disabled || item.href === "#") {
                  return (
                    <span
                      key={item.label}
                      className={`${base} text-brand-primary/35 border-transparent`}
                    >
                      {item.label}
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`${base} ${
                      isActive
                        ? "border-brand-primary bg-brand-primary text-brand-dark shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.35)]"
                        : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark bg-transparent"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

            <div className="border-brand-primary/20 text-brand-primary/80 mt-4 flex items-center justify-between border-t pt-4 text-[0.65rem] tracking-[0.3em] uppercase">
              {/* {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : ( */}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
              {/* )} */}
              <span role="img" aria-label="Français" className="text-lg">
                🇫🇷
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

