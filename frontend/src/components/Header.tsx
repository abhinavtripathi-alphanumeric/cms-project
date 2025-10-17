'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Alphanumerics Ideas
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/articles/create" className="hover:text-blue-200 transition-colors">
                  Create Article
                </Link>
                <span>Welcome, {user?.username}</span>
                <button
                  onClick={logout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors">
                  Sign Up
                </Link> 
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;