'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Car, Clock, CheckCircle, AlertTriangle, Activity, Settings, FileText } from 'lucide-react';

interface AdminStats {
  pendingVerifications: number;
  pendingListings: number;
  totalUsers: number;
  totalListings: number;
  recentActivities: Array<{
    id: string;
    action_type: string;
    action: string;
    target_type: string;
    created_at: string;
    metadata: any;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'user_verification': return <Users className="h-4 w-4" />;
      case 'listing_approval': return <Car className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage user verifications and listing approvals</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Site Settings</h3>
                <p className="text-sm text-blue-700 mt-1">Manage coming soon page and video hero</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/settings">
                  Manage Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900">User Verifications</h3>
                <p className="text-sm text-green-700 mt-1">Review and approve user documents</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/admin/verifications">
                  Manage Verifications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-900">Vehicle Listings</h3>
                <p className="text-sm text-purple-700 mt-1">Manage and approve vehicle listings</p>
              </div>
              <Car className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/admin/vehicles">
                  Manage Listings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Verifications</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats?.pendingVerifications || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Listings</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats?.pendingListings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats?.totalListings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              User Verifications
            </CardTitle>
            <CardDescription className="text-sm">
              Review and approve user identity verifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats?.pendingVerifications || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Pending review</p>
              </div>
              <a
                href="/admin/verifications"
                className="bg-blue-600 text-white px-3 py-2 sm:px-4 text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Review
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Listing Approvals
            </CardTitle>
            <CardDescription className="text-sm">
              Review and approve vehicle listings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats?.pendingListings || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Pending approval</p>
              </div>
              <a
                href="/admin/listings"
                className="bg-blue-600 text-white px-3 py-2 sm:px-4 text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Review
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Admin Activities
          </CardTitle>
          <CardDescription>
            Latest actions taken by administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.action_type)}
                    <div>
                      <p className="font-medium">
                        {activity.action_type === 'user_verification' ? 'User Verification' : 'Listing Approval'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.metadata?.admin_name || 'Admin'} {activity.action} a {activity.target_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getActivityColor(activity.action)}>
                      {activity.action}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent activities</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
