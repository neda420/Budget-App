'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

/**
 * Root page — redirect to /dashboard if authenticated, otherwise /login.
 * Also handles deep-link restores from the 404.html SPA fallback.
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Restore deep-linked path (set by 404.html fallback)
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      const destination = decodeURIComponent(redirect);
      router.replace(destination);
      return;
    }

    if (isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
