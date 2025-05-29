'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, Wifi, WifiOff, Settings } from 'lucide-react';

interface EmailQueueStats {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  total: number;
}

interface EmailQueueItem {
  id: string;
  to_addresses: string[];
  cc_addresses?: string[];
  bcc_addresses?: string[];
  subject: string;
  template: string;
  template_data: any;
  html?: string;
  text?: string;
  status: string;
  attempts: number;
  max_attempts: number;
  last_error?: string;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

interface ConnectionTestResult {
  success: boolean;
  error?: string;
  config?: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    from: {
      name: string;
      email: string;
    };
  };
  message?: string;
}

export default function EmailManagementPage() {
  const [stats, setStats] = useState<EmailQueueStats | null>(null);
  const [recentEmails, setRecentEmails] = useState<EmailQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [testTemplate, setTestTemplate] = useState('welcome');
  const [connectionTest, setConnectionTest] = useState<ConnectionTestResult | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const { toast } = useToast();

  const fetchEmailQueue = async () => {
    try {
      const response = await fetch('/api/admin/email/queue');
      if (!response.ok) throw new Error('Failed to fetch email queue');
      
      const data = await response.json();
      setStats(data.stats);
      setRecentEmails(data.recentEmails);
    } catch (error) {
      console.error('Error fetching email queue:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch email queue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailQueue();
    // Refresh every 30 seconds
    const interval = setInterval(fetchEmailQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const processQueue = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/admin/email/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10 }),
      });

      if (!response.ok) throw new Error('Failed to process queue');
      
      const result = await response.json();
      toast({
        title: 'Queue Processed',
        description: `Processed: ${result.processed}, Failed: ${result.failed}`,
      });
      
      // Refresh the queue
      await fetchEmailQueue();
    } catch (error) {
      console.error('Error processing queue:', error);
      toast({
        title: 'Error',
        description: 'Failed to process email queue',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const sendActualTestEmail = async () => {
    if (!testEmailAddress) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setSendingTestEmail(true);
    try {
      const response = await fetch('/api/admin/email/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          testType: 'send',
          testEmail: testEmailAddress,
          template: testTemplate
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send test email');
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Test Email Sent',
          description: `Test email sent successfully to ${testEmailAddress}`,
        });
      } else {
        throw new Error(result.error || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive',
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  const testSMTPConnection = async () => {
    setTestingConnection(true);
    try {
      const response = await fetch('/api/admin/email/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType: 'connection' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to test connection');
      }
      
      const result = await response.json();
      setConnectionTest(result);
      
      if (result.success) {
        toast({
          title: 'Connection Test Successful',
          description: 'SMTP connection is working properly',
        });
      } else {
        toast({
          title: 'Connection Test Failed',
          description: result.error || 'SMTP connection failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionTest({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to test connection'
      });
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to test connection',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Management</h1>
        <p className="text-muted-foreground">Monitor and manage email queue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.processing || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.sent || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.failed || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Process Email Queue</CardTitle>
            <CardDescription>Manually process pending emails</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={processQueue} 
              disabled={processing || (stats?.pending || 0) === 0}
              className="w-full"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Process Queue ({stats?.pending || 0} pending)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test SMTP Connection */}
        <Card>
          <CardHeader>
            <CardTitle>Test SMTP Connection</CardTitle>
            <CardDescription>Test your SMTP server connection without sending emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testSMTPConnection} 
              disabled={testingConnection}
              className="w-full"
            >
              {testingConnection ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Test SMTP Connection
                </>
              )}
            </Button>
            {connectionTest && (
              <div className="mt-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  {connectionTest.success ? (
                    <Badge className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connection Successful
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Connection Failed
                    </Badge>
                  )}
                </div>
                
                {connectionTest.config && (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">SMTP Host:</span>
                      <span>{connectionTest.config.host}</span>
                      <span className="font-medium">Port:</span>
                      <span>{connectionTest.config.port}</span>
                      <span className="font-medium">Secure:</span>
                      <span>{connectionTest.config.secure ? 'Yes (TLS)' : 'No'}</span>
                      <span className="font-medium">User:</span>
                      <span>{connectionTest.config.user}</span>
                      <span className="font-medium">From Name:</span>
                      <span>{connectionTest.config.from.name}</span>
                      <span className="font-medium">From Email:</span>
                      <span>{connectionTest.config.from.email}</span>
                    </div>
                  </div>
                )}
                
                {connectionTest.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    <strong>Error Details:</strong><br />
                    {connectionTest.error}
                  </div>
                )}
                
                {connectionTest.message && (
                  <div className="mt-3 text-sm text-gray-600">
                    {connectionTest.message}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Test Email */}
        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>Send a test email to verify complete email functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="test-email-address">Email Address</Label>
              <Input
                id="test-email-address"
                type="email"
                placeholder="Enter email address to receive test email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="test-template">Template</Label>
              <Select value={testTemplate} onValueChange={setTestTemplate}>
                <SelectTrigger id="test-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="verification-approved">Verification Approved</SelectItem>
                  <SelectItem value="verification-rejected">Verification Rejected</SelectItem>
                  <SelectItem value="listing-approved">Listing Approved</SelectItem>
                  <SelectItem value="listing-rejected">Listing Rejected</SelectItem>
                  <SelectItem value="new-message">New Message</SelectItem>
                  <SelectItem value="password-reset">Password Reset</SelectItem>
                  <SelectItem value="subscription-confirmation">Subscription Confirmation</SelectItem>
                  <SelectItem value="listing-expiring">Listing Expiring</SelectItem>
                  <SelectItem value="admin-notification">Admin Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={sendActualTestEmail} 
              disabled={sendingTestEmail || !testEmailAddress}
              className="w-full"
            >
              {sendingTestEmail ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Emails */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Emails</CardTitle>
          <CardDescription>Last 20 emails in the queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">To</th>
                  <th className="text-left p-2">Template</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Attempts</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {recentEmails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted-foreground">
                      No emails in queue
                    </td>
                  </tr>
                ) : (
                  recentEmails.map((email) => (
                    <tr key={email.id} className="border-b">
                      <td className="p-2">
                        <div className="max-w-xs truncate">
                          {email.to_addresses?.join(', ') || 'No recipients'}
                        </div>
                      </td>
                      <td className="p-2">{email.template}</td>
                      <td className="p-2">{getStatusBadge(email.status)}</td>
                      <td className="p-2">{email.attempts}/{email.max_attempts}</td>
                      <td className="p-2">
                        {new Date(email.created_at).toLocaleString()}
                      </td>
                      <td className="p-2">
                        {email.last_error && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm truncate max-w-xs">{email.last_error}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
