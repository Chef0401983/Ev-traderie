'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import Logo from '@/components/ui/Logo';
import { Menu, X, Home, Car, MessageCircle, User, Settings } from 'lucide-react';
import { useState } from 'react';

interface StandardLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export default function StandardLayout({ 
  children, 
  showNavigation = true, 
  showBottomNav = true,
  className = '' 
}: StandardLayoutProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const userType = isLoaded ? (user?.publicMetadata.userType as string) : null;
  const isAuthenticated = isLoaded && user;

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home, public: true },
    { href: '/vehicles', label: 'Browse', icon: Car, public: true },
    { href: '/dashboard/individual', label: 'Dashboard', icon: User, auth: true, userTypes: ['individual'] },
    { href: '/dashboard/dealership', label: 'Dashboard', icon: User, auth: true, userTypes: ['dealership'] },
    { href: '/dashboard/individual/messages', label: 'Messages', icon: MessageCircle, auth: true, userTypes: ['individual'] },
    { href: '/dashboard/dealership/messages', label: 'Messages', icon: MessageCircle, auth: true, userTypes: ['dealership'] },
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (item.public) return true;
    if (item.auth && !isAuthenticated) return false;
    if (item.userTypes && userType && !item.userTypes.includes(userType)) return false;
    return true;
  });

  // Show bottom nav on mobile for all pages when showBottomNav is true
  const shouldShowBottomNav = showBottomNav;
  
  // Create bottom nav items - prioritize key navigation items
  const getBottomNavItems = () => {
    const baseItems = [
      { href: '/', label: 'Home', icon: Home },
      { href: '/vehicles', label: 'Browse', icon: Car },
    ];

    if (isAuthenticated) {
      // Add user-specific dashboard and messages
      if (userType === 'individual') {
        baseItems.push(
          { href: '/dashboard/individual', label: 'Dashboard', icon: User },
          { href: '/dashboard/individual/messages', label: 'Messages', icon: MessageCircle }
        );
      } else if (userType === 'dealership') {
        baseItems.push(
          { href: '/dashboard/dealership', label: 'Dashboard', icon: User },
          { href: '/dashboard/dealership/messages', label: 'Messages', icon: MessageCircle }
        );
      } else {
        // Fallback for authenticated users without specific type
        baseItems.push(
          { href: '/dashboard/individual', label: 'Dashboard', icon: User },
          { href: '/dashboard/individual/messages', label: 'Messages', icon: MessageCircle }
        );
      }
    } else {
      // For non-authenticated users, add profile/sign in option
      baseItems.push({ href: '/sign-in', label: 'Profile', icon: User });
    }

    return baseItems.slice(0, 4); // Limit to 4 items for mobile
  };

  const bottomNavItems = getBottomNavItems();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-custom px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Logo size="md" href="/" />
            
            {/* Desktop Navigation */}
            {showNavigation && (
              <nav className="hidden md:flex items-center space-x-6">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${
                      pathname === item.href ? 'nav-link-active' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/sign-in" className="btn-outline text-sm px-3 py-1">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="btn-primary text-sm px-3 py-1">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-2 py-2 rounded-md text-base ${
                      pathname === item.href 
                        ? 'bg-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between">
                      <Link 
                        href="/profile" 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link 
                        href="/sign-in" 
                        className="btn-outline text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/sign-up" 
                        className="btn-primary text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - Show on all pages */}
      {shouldShowBottomNav && (
        <nav className="md:hidden bg-white border-t border-gray-200 sticky bottom-0 z-50">
          <div className="flex justify-around py-2">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Logo size="sm" />
              <span className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} EV-Trader. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
