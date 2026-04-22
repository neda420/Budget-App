'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, clearToken } from '@/lib/auth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/receipts', label: 'Receipts', icon: '🧾' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace('/login');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="bg-brand-700 text-white px-4 py-3 flex items-center justify-between safe-area-top">
        <span className="font-bold text-lg tracking-tight">BudgetLens</span>
        <button
          onClick={handleLogout}
          className="text-sm text-brand-100 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom navigation (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-4 text-xs gap-1 transition-colors ${
                  active ? 'text-brand-600 font-medium' : 'text-gray-500 hover:text-brand-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
