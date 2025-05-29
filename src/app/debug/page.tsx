'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/profile');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to check profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkProfile} disabled={loading}>
            {loading ? 'Checking...' : 'Check/Create Admin Profile'}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
