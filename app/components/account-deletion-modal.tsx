'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/contexts/customer-auth-context';
import { customerAuthApi } from '@/lib/customer-auth';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Trash2, 
  Loader2,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDeletionModal({ isOpen, onClose }: AccountDeletionModalProps) {
  const router = useRouter();
  const { user, logout } = useCustomerAuth();
  
  const [step, setStep] = useState<'warning' | 'confirmation' | 'processing' | 'completed'>('warning');

  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error('User not found. Please log in again.');
      return;
    }
    
    setStep('processing');
    setIsDeleting(true);
    
    try {
      // Delete account using the API class - no password required
      const response = await customerAuthApi.deleteAccount({});
      
      setStep('completed');
      toast.success('Account deleted successfully');
      
      // Show completed message briefly, then logout and redirect
      setTimeout(async () => {
        try {
          await logout();
        } catch (error) {
          // Ignore logout errors - they're expected when account is deleted
          console.log('Logout completed (account was deleted)');
        }
        onClose();
        router.push('/');
      }, 1500);
    } catch (error: any) {
      console.error('Delete account error:', error);
      
      // Show more specific error messages
      if (error.message.includes('Network error')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('Unauthorized')) {
        toast.error('Session expired. Please log in again.');
      } else if (error.message.includes('already been deleted')) {
        toast.error('Your account has already been deleted. You will be logged out.');
        // Logout and redirect after brief delay
        setTimeout(async () => {
          try {
            await logout();
          } catch (error) {
            // Ignore logout errors - they're expected when account is deleted
            console.log('Logout completed (account was deleted)');
          }
          onClose();
          router.push('/');
        }, 1500);
        return;
      } else {
        toast.error(error.message || 'Failed to delete account. Please try again.');
      }
      
      setStep('confirmation');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-red-600">Delete Account</CardTitle>
                  <CardDescription>This action cannot be undone</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {step === 'warning' && (
              <div className="space-y-6">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Warning:</strong> Deleting your account will permanently remove all your data, 
                    including orders, preferences, and account information. This action cannot be undone.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">What happens when you delete your account:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>All your personal information will be permanently deleted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Your order history and preferences will be lost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>You will lose access to any saved payment methods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Your account cannot be recovered after deletion</span>
                    </li>
                  </ul>
                </div>
                

                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setStep('confirmation')}
                    className="flex-1"
                  >
                    Continue to Delete
                  </Button>
                </div>
              </div>
            )}
            
            {step === 'confirmation' && (
              <div className="space-y-6">
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Final Confirmation:</strong> Please carefully review and confirm your account deletion.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for deletion (optional)</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Please let us know why you're leaving..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('warning')} className="flex-1">
                    Go Back
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting Account...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete My Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {step === 'processing' && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deleting Your Account</h3>
                <p className="text-gray-600">Please wait while we process your request...</p>
              </div>
            )}
            
            {step === 'completed' && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Deleted Successfully</h3>
                <p className="text-gray-600 mb-4">
                  Your account has been deleted and your data has been anonymized. 
                  You are being redirected to the home page.
                </p>
                <p className="text-sm text-gray-500">
                  Note: Your data will be permanently deleted after 30 days in accordance with our data retention policy.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
