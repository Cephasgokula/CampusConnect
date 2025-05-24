
import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Mail,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Save,
  Download,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Profile Settings
    email: "emily.johnson@university.edu",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    weeklyDigest: false,
    marketingEmails: false,
    
    // Privacy Settings
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataSharing: false,
    
    // Appearance Settings
    theme: "light",
    language: "english",
    compactMode: false,
    animations: true,
    
    // System Settings
    autoSave: true,
    soundEffects: true,
    dataUsage: "normal"
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving settings:", settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Customize your experience and manage your preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Settings Menu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent">
                    <TabsTrigger value="profile" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="w-full justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="w-full justify-start">
                      <Palette className="w-4 h-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="system" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      System
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" orientation="vertical">
              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription>Manage your account information and security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                          <Input
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleSettingChange("profile", "email", e.target.value)}
                            className="bg-white/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Current Password</label>
                          <Input
                            type="password"
                            value={settings.currentPassword}
                            onChange={(e) => handleSettingChange("profile", "currentPassword", e.target.value)}
                            className="bg-white/50"
                            placeholder="Enter current password"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
                          <Input
                            type="password"
                            value={settings.newPassword}
                            onChange={(e) => handleSettingChange("profile", "newPassword", e.target.value)}
                            className="bg-white/50"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm Password</label>
                          <Input
                            type="password"
                            value={settings.confirmPassword}
                            onChange={(e) => handleSettingChange("profile", "confirmPassword", e.target.value)}
                            className="bg-white/50"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-green-600" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Control how you receive notifications and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
                        { key: "pushNotifications", label: "Push Notifications", description: "Get instant browser notifications" },
                        { key: "eventReminders", label: "Event Reminders", description: "Reminders before events start" },
                        { key: "weeklyDigest", label: "Weekly Digest", description: "Summary of weekly activities" },
                        { key: "marketingEmails", label: "Marketing Emails", description: "Promotional content and updates" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                          <Switch
                            checked={settings[item.key as keyof typeof settings] as boolean}
                            onCheckedChange={(checked) => handleSettingChange("notifications", item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>Manage your privacy settings and data sharing preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                          <p className="text-sm text-gray-600">Who can see your profile information</p>
                        </div>
                        <select
                          value={settings.profileVisibility}
                          onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <option value="public">Public</option>
                          <option value="university">University Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      
                      {[
                        { key: "showEmail", label: "Show Email Address", description: "Display email in your profile" },
                        { key: "showPhone", label: "Show Phone Number", description: "Display phone in your profile" },
                        { key: "dataSharing", label: "Anonymous Data Sharing", description: "Help improve our services" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                          <Switch
                            checked={settings[item.key as keyof typeof settings] as boolean}
                            onCheckedChange={(checked) => handleSettingChange("privacy", item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-pink-600" />
                      Appearance & Display
                    </CardTitle>
                    <CardDescription>Customize the look and feel of your interface</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900">Theme</h4>
                          <p className="text-sm text-gray-600">Choose your preferred color theme</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={settings.theme === "light" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSettingChange("appearance", "theme", "light")}
                          >
                            <Sun className="w-4 h-4 mr-1" />
                            Light
                          </Button>
                          <Button
                            variant={settings.theme === "dark" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSettingChange("appearance", "theme", "dark")}
                          >
                            <Moon className="w-4 h-4 mr-1" />
                            Dark
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900">Language</h4>
                          <p className="text-sm text-gray-600">Select your preferred language</p>
                        </div>
                        <select
                          value={settings.language}
                          onChange={(e) => handleSettingChange("appearance", "language", e.target.value)}
                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                        </select>
                      </div>

                      {[
                        { key: "compactMode", label: "Compact Mode", description: "Use less space between elements" },
                        { key: "animations", label: "Animations", description: "Enable smooth transitions and animations" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                          <Switch
                            checked={settings[item.key as keyof typeof settings] as boolean}
                            onCheckedChange={(checked) => handleSettingChange("appearance", item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Settings */}
              <TabsContent value="system" className="space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-orange-600" />
                      System Preferences
                    </CardTitle>
                    <CardDescription>Configure system behavior and performance settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { key: "autoSave", label: "Auto Save", description: "Automatically save your changes" },
                        { key: "soundEffects", label: "Sound Effects", description: "Play sounds for notifications and actions" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                          <Switch
                            checked={settings[item.key as keyof typeof settings] as boolean}
                            onCheckedChange={(checked) => handleSettingChange("system", item.key, checked)}
                          />
                        </div>
                      ))}

                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900">Data Usage</h4>
                          <p className="text-sm text-gray-600">Control how much data the app uses</p>
                        </div>
                        <select
                          value={settings.dataUsage}
                          onChange={(e) => handleSettingChange("system", "dataUsage", e.target.value)}
                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-4">Danger Zone</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">
                          <Download className="w-4 h-4 mr-2" />
                          Download My Data
                        </Button>
                        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
