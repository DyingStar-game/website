'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
  hidden?: boolean;
};

const leftNavItems: NavItem[] = [
  { label: 'PROJECT', href: '/' },
  { label: 'LORE', href: '#', disabled: true },
  { label: 'GALAXIES', href: '#', disabled: true, hidden: true },
];

const rightNavItems: NavItem[] = [
  { label: 'CONTRIBUTE', href: '/contribute' },
  { label: 'ROAD MAP', href: '/roadmap', hidden: true },
  { label: 'SERVERS STATUS', href: '#', disabled: true },
  { label: 'FORUM', href: '#', disabled: true },
];

function buildLinkClasses(isActive: boolean, isDisabled?: boolean) {
  const base =
    'uppercase text-[0.58rem] tracking-[0.42em] px-5 py-2 rounded-none transition-all duration-300 font-semibold font-poppins border';

  if (isDisabled) {
    return cn(base, 'border-brand-primary/40 text-brand-primary/40 cursor-not-allowed');
  }

  if (isActive) {
    return cn(
      base,
      'border-brand-primary bg-brand-primary text-brand-dark shadow-[0_0_18px_rgba(var(--brand-primary-rgb),0.35)]'
    );
  }

  return cn(
    base,
    'border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary hover:text-brand-dark'
  );
}

export default function Navigation() {
  const { user, logout, isAuthenticated } = useSimpleAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navGroupClasses = cn(
    'flex items-center gap-2 px-6 py-3 rounded-none border backdrop-blur-xl font-poppins',
    'border-brand-primary/40 bg-brand-dark/90 shadow-[0_0_35px_rgba(var(--brand-dark-rgb),0.45)]'
  );

  const isItemActive = (item: NavItem) => {
    if (item.disabled || item.href === '#') {
      return false;
    }

    if (item.href === '/') {
      return pathname === '/' || pathname === '/home';
    }

    return pathname.startsWith(item.href);
  };

  const handleLogout = () => {
    void logout();
  };

  const renderNavItem = (item: NavItem) => {
    if (item.hidden) {
      return null;
    }

    const isActive = isItemActive(item);
    const classes = buildLinkClasses(isActive, item.disabled);

    if (item.disabled || item.href === '#') {
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
      className={`flex items-center justify-center ${className ?? ''}`.trim()}
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-brand-primary/40 bg-brand-dark shadow-[0_10px_30px_rgba(var(--brand-dark-rgb),0.65)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-brand-primary" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-brand-primary/30" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="md:hidden relative flex items-center h-20">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative z-10 text-brand-primary transition-colors hover:text-white"
              aria-label="Ouvrir le menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {renderLogo('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}

            <div className="ml-auto flex items-center gap-2 relative z-10">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="text-brand-primary transition-colors hover:text-white flex items-center gap-1 text-xs uppercase tracking-[0.25em] font-poppins"
                  >
                    <User className="w-4 h-4" />
                    {user?.username}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Se déconnecter"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-primary/60 text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-dark"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="uppercase text-[0.65rem] tracking-[0.3em] text-brand-primary hover:text-white font-poppins"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
              <span role="img" aria-label="Français" className="text-lg">
                🇫🇷
              </span>
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center h-20 gap-6">
            <div className="flex items-center justify-end">
              <div className={navGroupClasses}>
                {leftNavItems.filter((item) => !item.hidden).map((item) => renderNavItem(item))}
              </div>
            </div>

            {renderLogo('mx-auto md:justify-self-center')}
            <div className="flex items-center justify-end gap-6">
              <div className={navGroupClasses}>
                {rightNavItems.filter((item) => !item.hidden).map((item) => renderNavItem(item))}
              </div>
              <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em]">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-brand-primary hover:text-white font-poppins"
                    >
                      <User className="w-4 h-4" />
                      {user?.username}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      aria-label="Se déconnecter"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/60 text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-dark"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className={buildLinkClasses(false)}>
                    LOGIN
                  </Link>
                )}
                <span role="img" aria-label="Français" className="text-xl">
                  🇫🇷
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-brand-primary/30 bg-brand-dark/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {[...leftNavItems, ...rightNavItems].filter((item) => !item.hidden).map((item) => {
              const isActive = isItemActive(item);
              const base =
                'block px-4 py-3 rounded-none border uppercase text-xs tracking-[0.35em] font-poppins transition-colors duration-300';

              if (item.disabled || item.href === '#') {
                return (
                  <span
                    key={item.label}
                    className={`${base} border-transparent text-brand-primary/35`}
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
                      ? 'border-brand-primary bg-brand-primary text-brand-dark shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.35)]'
                      : 'border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary hover:text-brand-dark'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-4 flex items-center justify-between border-t border-brand-primary/20 pt-4 text-[0.65rem] uppercase tracking-[0.3em] text-brand-primary/80">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}
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
