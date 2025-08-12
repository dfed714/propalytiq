'use client';

import React, {useState } from 'react';
import MainLayout from '@components/Layout/MainLayout';
import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Switch } from '@components/ui/switch';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailReports: true,
    marketUpdates: false,
    productUpdates: true,
    securityAlerts: true
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update session storage with new name
      try {
        const userSession = sessionStorage.getItem('userSession');
        if (userSession) {
          const userData = JSON.parse(userSession);
          userData.name = `${userProfile.firstName} ${userProfile.lastName}`;
          userData.email = userProfile.email;
          sessionStorage.setItem('userSession', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
      
      setIsLoading(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-gray-500">Manage your account preferences</p>
          </div>
        </div>
        
        <div className="max-w-3xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          value={userProfile.firstName}
                          onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          value={userProfile.lastName}
                          onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Email Reports</h4>
                      <p className="text-sm text-gray-500">Receive your property analysis reports via email</p>
                    </div>
                    <Switch 
                      checked={notifications.emailReports}
                      onCheckedChange={() => handleNotificationChange('emailReports')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Market Updates</h4>
                      <p className="text-sm text-gray-500">Receive updates about property market trends</p>
                    </div>
                    <Switch 
                      checked={notifications.marketUpdates}
                      onCheckedChange={() => handleNotificationChange('marketUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Product Updates</h4>
                      <p className="text-sm text-gray-500">Be notified about new features and improvements</p>
                    </div>
                    <Switch 
                      checked={notifications.productUpdates}
                      onCheckedChange={() => handleNotificationChange('productUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Security Alerts</h4>
                      <p className="text-sm text-gray-500">Get important security notifications about your account</p>
                    </div>
                    <Switch 
                      checked={notifications.securityAlerts}
                      onCheckedChange={() => handleNotificationChange('securityAlerts')}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast.success('Notification preferences saved')}>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast.success('Password changed successfully')}>
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
