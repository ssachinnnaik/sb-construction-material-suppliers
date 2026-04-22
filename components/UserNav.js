'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookMarked, LogOut } from 'lucide-react';

export default function UserNav() {
  const [userName, setUserName] = useState('');
  const [catalogCount, setCatalogCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Read user session from cookie
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('user_session='));
    if (sessionCookie) {
      try {
        const val = decodeURIComponent(sessionCookie.split('=').slice(1).join('='));
        const session = JSON.parse(val);
        setUserName(session.name || '');
      } catch {
        setUserName('');
      }
    }

    // Read catalog count from localStorage
    const updateCount = () => {
      try {
        const catalog = JSON.parse(localStorage.getItem('sb_catalog') || '[]');
        setCatalogCount(catalog.length);
      } catch {
        setCatalogCount(0);
      }
    };

    updateCount();
    // Listen for catalog changes
    window.addEventListener('catalog_updated', updateCount);
    return () => window.removeEventListener('catalog_updated', updateCount);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/user-auth', { method: 'DELETE' });
    // Clear the cookie client-side too
    document.cookie = 'user_session=; max-age=0; path=/';
    router.push('/');
  };

  return (
    <nav className="user-nav">
      <div className="container user-nav-inner">
        {/* Circular Logo */}
        <Link href="/home" className="user-nav-logo">
          <span className="nav-logo-circle">
            <Image src="/logo.png" alt="SB Construction" width={48} height={48} style={{ objectFit: 'cover', width: '100%', height: '100%' }} priority />
          </span>
          <span className="nav-logo-text"><strong>SB</strong> Construction</span>
        </Link>

        {/* Links */}
        <div className="user-nav-links">
          <Link href="/home" className={`user-nav-link ${pathname === '/home' ? 'active' : ''}`}>
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link href="/catalog" className={`user-nav-link ${pathname === '/catalog' ? 'active' : ''}`}>
            <BookMarked size={16} />
            <span>My Catalog</span>
            {catalogCount > 0 && (
              <span className="catalog-badge">{catalogCount}</span>
            )}
          </Link>
        </div>

        {/* User + Logout */}
        <div className="user-nav-right">
          {userName && <span className="user-nav-greeting">Hi, {userName.split(' ')[0]} 👋</span>}
          <button onClick={handleLogout} className="user-nav-logout" title="Logout">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
