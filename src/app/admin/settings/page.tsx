'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          console.error('Failed to load settings');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Find a specific setting by key
  const findSetting = (key: string) => {
    return settings.find(setting => setting.key === key);
  };

  // Update a setting value
  const updateSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      // Update local state
      setSettings(prevSettings => 
        prevSettings.map(setting => 
          setting.key === key ? { ...setting, value } : setting
        )
      );

      console.log('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setSaving(false);
    }
  };

  // Toggle coming soon mode
  const toggleComingSoon = () => {
    const currentSetting = findSetting('coming_soon');
    const currentValue = currentSetting?.value?.enabled || false;
    
    // Update the coming_soon setting with the new enabled value
    const updatedValue = {
      ...currentSetting?.value,
      enabled: !currentValue
    };
    
    updateSetting('coming_soon', updatedValue);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const comingSoonMode = findSetting('coming_soon')?.value?.enabled ?? false;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      
      <div className="grid gap-6">
        {/* Coming Soon Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Site Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Coming Soon Mode</h3>
                <p className="text-sm text-gray-600">
                  When enabled, visitors will see a coming soon page instead of the full site
                </p>
                <p className="text-sm font-medium mt-2">
                  Current Status: {comingSoonMode ? 'ENABLED' : 'DISABLED'}
                </p>
              </div>
              <Button
                onClick={toggleComingSoon}
                disabled={saving}
                variant={comingSoonMode ? 'destructive' : 'default'}
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {comingSoonMode ? 'Disable' : 'Enable'} Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Other Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings.length > 0 ? (
                settings.map((setting) => (
                  <div key={setting.id} className="border-b pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{setting.key}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                        <p className="text-sm font-mono mt-1">
                          Value: {JSON.stringify(setting.value)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No settings found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
