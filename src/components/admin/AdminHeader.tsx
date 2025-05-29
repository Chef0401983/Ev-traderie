'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { Bell, Search, User, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Sign Out Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-900"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </Button>

          {/* User info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || user?.firstName || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Admin"
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
