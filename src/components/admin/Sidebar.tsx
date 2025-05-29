'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Car,
  FileCheck,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  X,
  Mail
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'User Verifications', href: '/admin/verifications', icon: FileCheck },
  { name: 'Listing Approvals', href: '/admin/listings', icon: Car },
  { name: 'User Management', href: '/admin/user-management', icon: Users },
  { name: 'Email Management', href: '/admin/email-management', icon: Mail },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between h-16 px-4 lg:hidden">
          <h1 className="text-xl font-bold text-white">EV-Trader Admin</h1>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop logo */}
        <div className="hidden lg:flex items-center h-16 px-4">
          <h1 className="text-xl font-bold text-white">EV-Trader Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1 pb-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose()} // Close mobile sidebar on navigation
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign out button */}
        <div className="p-2">
          <button 
            onClick={handleSignOut}
            className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
