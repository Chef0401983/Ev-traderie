"use client";

import { UserProfile, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import WelcomeHandler from '@/components/auth/WelcomeHandler';

interface DashboardStats {
  activeListings: number;
  savedVehicles: number;
  unreadMessages: number;
}

interface RecentActivity {
  id: string;
  type: 'listing_created' | 'listing_approved' | 'listing_rejected' | 'message_received' | 'vehicle_saved';
  title: string;
  description: string;
  timestamp: string;
}

export default function IndividualDashboardPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    savedVehicles: 0,
    unreadMessages: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's listings
      const listingsResponse = await fetch('/api/vehicles/my-listings');
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        const approvedListings = listingsData.vehicles?.filter((v: any) => v.approval_status === 'approved') || [];
        setStats(prev => ({ ...prev, activeListings: approvedListings.length }));
      }

      // Fetch saved vehicles (if API exists)
      try {
        const savedResponse = await fetch('/api/saved-vehicles');
        if (savedResponse.ok) {
          const savedData = await savedResponse.json();
          setStats(prev => ({ ...prev, savedVehicles: savedData.count || 0 }));
        }
      } catch (error) {
        // Saved vehicles API might not exist yet
        console.log('Saved vehicles API not available');
      }

      // Fetch messages (if API exists)
      try {
        const messagesResponse = await fetch('/api/messages/unread-count');
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setStats(prev => ({ ...prev, unreadMessages: messagesData.count || 0 }));
        }
      } catch (error) {
        // Messages API might not exist yet
        console.log('Messages API not available');
      }

      // Mock recent activities for now (replace with real API when available)
      setRecentActivities([
        {
          id: '1',
          type: 'listing_created',
          title: 'New listing created',
          description: 'Your vehicle listing is pending approval',
          timestamp: new Date().toISOString()
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'listing_created':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'listing_approved':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'message_received':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };
  
  return (
    <DashboardLayout userType="individual">
      <WelcomeHandler />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <button 
            onClick={fetchDashboardData}
            className="btn-secondary text-sm px-3 py-1"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-medium">Active Listings</h3>
              <span className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold mt-2">{loading ? '...' : stats.activeListings}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.activeListings === 0 ? 'No active listings yet' : 'Approved and live'}
            </p>
          </div>
          
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-medium">Saved Vehicles</h3>
              <span className="text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold mt-2">{loading ? '...' : stats.savedVehicles}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.savedVehicles === 0 ? 'No saved vehicles yet' : 'Vehicles you liked'}
            </p>
          </div>
          
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-medium">Unread Messages</h3>
              <span className="text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold mt-2">{loading ? '...' : stats.unreadMessages}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.unreadMessages === 0 ? 'No unread messages' : 'New inquiries'}
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <a href="/dashboard/individual/listings/new" className="btn-primary text-center py-3 text-sm md:text-base">
              Create Listing
            </a>
            <a href="/dashboard/individual/messages" className="btn-secondary text-center py-3 text-sm md:text-base">
              Check Messages
            </a>
            <a href="/vehicles" className="btn-accent text-center py-3 text-sm md:text-base">
              Browse Vehicles
            </a>
            <a href="/dashboard/individual/settings" className="bg-gray-200 text-secondary hover:bg-gray-300 transition-colors rounded-md text-center py-3 text-sm md:text-base">
              Settings
            </a>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Recent Activity</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading activity...</p>
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No recent activity to display</p>
              <p className="mt-2 text-sm">Your activity will appear here once you start using the platform</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
