"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Container } from '@/components/ui/container';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'individual' | 'dealership';
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const individualMenuItems = [
    { label: 'Dashboard', href: '/dashboard/individual', icon: 'home' },
    { label: 'Create Listing', href: '/dashboard/individual/listings/new', icon: 'plus' },
    { label: 'My Listings', href: '/dashboard/individual/listings', icon: 'car' },
    { label: 'Messages', href: '/dashboard/individual/messages', icon: 'message' },
    { label: 'Saved Vehicles', href: '/dashboard/individual/saved', icon: 'heart' },
    { label: 'Account Settings', href: '/dashboard/individual/settings', icon: 'settings' },
  ];
  
  const dealershipMenuItems = [
    { label: 'Dashboard', href: '/dashboard/dealership', icon: 'home' },
    { label: 'Inventory', href: '/dashboard/dealership/inventory', icon: 'car' },
    { label: 'Add Vehicle', href: '/dashboard/dealership/inventory/new', icon: 'plus' },
    { label: 'Inquiries', href: '/dashboard/dealership/inquiries', icon: 'message' },
    { label: 'Analytics', href: '/dashboard/dealership/analytics', icon: 'chart' },
    { label: 'Team', href: '/dashboard/dealership/team', icon: 'users' },
    { label: 'Dealership Profile', href: '/dashboard/dealership/profile', icon: 'store' },
    { label: 'Settings', href: '/dashboard/dealership/settings', icon: 'settings' },
  ];
  
  const menuItems = userType === 'individual' ? individualMenuItems : dealershipMenuItems;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-poppins font-semibold text-primary hover:text-primary/80 transition-colors">
          EV-Trader
        </Link>
        <div className="flex items-center space-x-3">
          {isLoaded && user && (
            <UserButton afterSignOutUrl="/" />
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white shadow-sm border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xl font-poppins font-semibold text-primary">EV-Trader</span>
            </Link>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            {isLoaded && user && (
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <div>
                  <p className="font-medium text-gray-900 font-lato text-sm">{user.fullName || user.username}</p>
                  <p className="text-xs text-gray-500 capitalize font-lato bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mt-1">{userType}</p>
                </div>
              </div>
            )}
          </div>
          
          <nav className="p-4 flex-1">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 font-lato font-medium group"
                  >
                    <SidebarIcon name={item.icon} />
                    <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="w-64 bg-white h-full shadow-xl">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <Link href="/" className="text-lg font-poppins font-semibold text-primary">
                  EV-Trader
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                {isLoaded && user && (
                  <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <div>
                      <p className="font-medium text-gray-900 font-lato text-sm">{user.fullName || user.username}</p>
                      <p className="text-xs text-gray-500 capitalize font-lato bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mt-1">{userType}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 font-lato font-medium group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <SidebarIcon name={item.icon} />
                        <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto pb-8">
          <Container size="xl" className="py-6 md:py-8">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}

// Helper component for sidebar icons
function SidebarIcon({ name }: { name: string }) {
  const className = "h-5 w-5";
  
  switch (name) {
    case 'home':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      );
    case 'car':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 001-1v-3a1 1 0 00-.7-.7l-3.5-1L8 5.4V4H3zm9.5 8V9l2.5.8V12h-2.5z" />
        </svg>
      );
    case 'plus':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    case 'message':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      );
    case 'heart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      );
    case 'settings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      );
    case 'search':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
      );
    case 'chart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      );
    case 'store':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
  }
}
