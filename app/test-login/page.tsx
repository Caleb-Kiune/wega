'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TestLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleTestLogin = async () => {
    try {
      setIsLoading(true);
      
      await login({
        username: 'admin',
        password: 'admin123',
        remember_me: false
      });
      
      toast.success('Test login successful!');
      
    } catch (error) {
      console.error('Test login failed:', error);
      toast.error('Test login failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Login</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            This page tests the login functionality with the correct credentials.
          </p>
          <Button 
            onClick={handleTestLogin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Login with admin/admin123'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
