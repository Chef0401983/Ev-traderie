"use client";

import { useUser } from '@clerk/nextjs';
import DashboardLayout from '../components/DashboardLayout';

export default function DealershipDashboardPage() {
  const { user, isLoaded } = useUser();
  
  return (
    <DashboardLayout userType="dealership">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dealership Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Active Inventory</h3>
              <span className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-sm text-gray-500 mt-1">No vehicles listed</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Inquiries</h3>
              <span className="text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-sm text-gray-500 mt-1">No new inquiries</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Page Views</h3>
              <span className="text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-sm text-gray-500 mt-1">No views yet</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Team Members</h3>
              <span className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold mt-2">1</p>
            <p className="text-sm text-gray-500 mt-1">Just you for now</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/dashboard/dealership/inventory/new" className="btn-primary text-center py-3">
              Add New Vehicle
            </a>
            <a href="/dashboard/dealership/inquiries" className="btn-secondary text-center py-3">
              View Inquiries
            </a>
            <a href="/dashboard/dealership/profile" className="btn-accent text-center py-3">
              Update Dealership Profile
            </a>
            <a href="/dashboard/dealership/team" className="bg-gray-200 text-secondary hover:bg-gray-300 transition-colors rounded-md text-center py-3">
              Manage Team
            </a>
          </div>
        </div>
        
        {/* Analytics Overview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Analytics Overview</h2>
            <a href="/dashboard/dealership/analytics" className="text-accent hover:underline text-sm">View Full Analytics</a>
          </div>
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No analytics data available yet</p>
            <p className="mt-2 text-sm">Start listing vehicles to see performance metrics</p>
          </div>
        </div>
        
        {/* Recent Inventory */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Inventory</h2>
            <a href="/dashboard/dealership/inventory" className="text-accent hover:underline text-sm">View All Inventory</a>
          </div>
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p>No inventory items yet</p>
            <p className="mt-2 text-sm">Add vehicles to your inventory to see them here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
