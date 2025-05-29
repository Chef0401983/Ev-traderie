'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Trash2, 
  Eye, 
  Shield, 
  Car,
  Building,
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  user_type: 'individual' | 'dealership';
  verification_status: string;
  is_admin: boolean;
  admin_role: string | null;
  created_at: string;
  vehicle_count: number;
  user_verifications?: Array<{
    id: string;
    status: string;
    created_at: string;
  }>;
  dealership_profiles?: Array<{
    dealership_name: string;
    website: string;
  }>;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User deleted successfully'
        });
        fetchUsers();
        setDeleteConfirm(null);
        setSelectedUser(null);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete user',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unverified</Badge>;
    }
  };

  const getUserTypeIcon = (userType: string) => {
    return userType === 'dealership' ? 
      <Building className="w-4 h-4" /> : 
      <User className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">User Management</h1>
        <p className="text-gray-600">Manage all registered users and their profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{users.length}</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Verified Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {users.filter(u => u.verification_status === 'verified').length}
              </span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Dealerships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {users.filter(u => u.user_type === 'dealership').length}
              </span>
              <Building className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {users.filter(u => u.is_admin).length}
              </span>
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by email, name, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Click on a user to view details or manage their account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 hidden sm:table-cell">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 hidden md:table-cell">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 hidden lg:table-cell">Vehicles</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 hidden lg:table-cell">Joined</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{user.full_name || 'No name'}</div>
                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                        <div className="text-xs text-gray-400 mt-1">{user.user_id}</div>
                        {user.is_admin && (
                          <Badge className="mt-1 bg-purple-100 text-purple-800">
                            <Shield className="w-3 h-3 mr-1" />
                            {user.admin_role || 'Admin'}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {getUserTypeIcon(user.user_type)}
                        <span className="capitalize">{user.user_type}</span>
                      </div>
                      {user.dealership_profiles?.[0] && (
                        <div className="text-sm text-gray-500 mt-1">
                          {user.dealership_profiles[0].dealership_name}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {getVerificationBadge(user.verification_status)}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span>{user.vehicle_count}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteConfirm(user.user_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>User Details</CardTitle>
                  <CardDescription>{selectedUser.user_id}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="font-medium">{selectedUser.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="font-medium">{selectedUser.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">User Type</label>
                  <p className="font-medium capitalize">{selectedUser.user_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Verification Status</label>
                  <div className="mt-1">{getVerificationBadge(selectedUser.verification_status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vehicle Listings</label>
                  <p className="font-medium">{selectedUser.vehicle_count}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined Date</label>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedUser.dealership_profiles?.[0] && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Dealership Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Dealership Name</label>
                      <p className="font-medium">{selectedUser.dealership_profiles[0].dealership_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Website</label>
                      <p className="font-medium">{selectedUser.dealership_profiles[0].website || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.is_admin && (
                <div className="border-t pt-4">
                  <Badge className="bg-purple-100 text-purple-800">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin User - {selectedUser.admin_role || 'Standard Admin'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Confirm Delete</CardTitle>
              <CardDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                User ID: <span className="font-mono">{deleteConfirm}</span>
              </p>
              <p className="text-sm text-gray-600">
                This will permanently delete:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                <li>User profile and authentication</li>
                <li>All vehicle listings</li>
                <li>All messages and conversations</li>
                <li>All verifications and documents</li>
                <li>All subscriptions and purchases</li>
              </ul>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteUser(deleteConfirm)}
              >
                Delete User
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
