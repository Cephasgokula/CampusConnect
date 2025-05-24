
import React, { useState } from "react";
import { Bell, Check, Clock, AlertCircle, Info, CheckCircle, X, Filter, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");

  const notifications = [
    {
      id: 1,
      title: "Event Registration Confirmation",
      message: "Your registration for 'AI & Machine Learning Workshop' has been confirmed. The event is scheduled for June 15, 2024.",
      type: "success",
      time: "2 minutes ago",
      read: false,
      category: "registration"
    },
    {
      id: 2,
      title: "Event Reminder",
      message: "Don't forget! 'Cultural Night 2024' starts in 2 hours. Venue: Main Auditorium",
      type: "reminder",
      time: "1 hour ago",
      read: false,
      category: "reminder"
    },
    {
      id: 3,
      title: "New Event Available",
      message: "A new workshop 'Photography Basics' has been added. Limited seats available. Register now!",
      type: "info",
      time: "3 hours ago",
      read: true,
      category: "announcement"
    },
    {
      id: 4,
      title: "Event Cancelled",
      message: "Unfortunately, the 'Outdoor Sports Day' scheduled for June 12 has been cancelled due to weather conditions.",
      type: "warning",
      time: "1 day ago",
      read: true,
      category: "cancellation"
    },
    {
      id: 5,
      title: "Registration Deadline Approaching",
      message: "Only 24 hours left to register for 'Career Guidance Seminar'. Don't miss this opportunity!",
      type: "urgent",
      time: "1 day ago",
      read: false,
      category: "deadline"
    },
    {
      id: 6,
      title: "Event Update",
      message: "The venue for 'Tech Symposium 2024' has been changed from Hall A to Main Auditorium.",
      type: "info",
      time: "2 days ago",
      read: true,
      category: "update"
    }
  ];

  const getNotificationIcon = (type: string) => {
    const icons = {
      success: CheckCircle,
      reminder: Clock,
      info: Info,
      warning: AlertCircle,
      urgent: AlertCircle
    };
    return icons[type as keyof typeof icons] || Info;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      success: "text-green-500 bg-green-50",
      reminder: "text-blue-500 bg-blue-50",
      info: "text-purple-500 bg-purple-50",
      warning: "text-orange-500 bg-orange-50",
      urgent: "text-red-500 bg-red-50"
    };
    return colors[type as keyof typeof colors] || "text-gray-500 bg-gray-50";
  };

  const getBadgeColor = (type: string) => {
    const colors = {
      success: "bg-green-100 text-green-800",
      reminder: "bg-blue-100 text-blue-800",
      info: "bg-purple-100 text-purple-800",
      warning: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "read") return notification.read;
    return notification.category === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">Stay updated with the latest events and announcements</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Notifications</p>
                    <p className="text-3xl font-bold">{notifications.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Unread</p>
                    <p className="text-3xl font-bold">{unreadCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Read</p>
                    <p className="text-3xl font-bold">{notifications.length - unreadCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notifications List */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="reminder">Reminders</TabsTrigger>
                <TabsTrigger value="registration">Registration</TabsTrigger>
                <TabsTrigger value="announcement" className="hidden lg:flex">Announcements</TabsTrigger>
                <TabsTrigger value="update" className="hidden lg:flex">Updates</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                    notification.read 
                      ? "bg-gray-50/50 border-gray-200/50" 
                      : "bg-white border-blue-200/50 shadow-sm ring-2 ring-blue-100/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", getNotificationColor(notification.type))}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={cn("font-semibold", notification.read ? "text-gray-700" : "text-gray-900")}>
                            {notification.title}
                          </h3>
                          <Badge className={getBadgeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className={cn("text-sm leading-relaxed", notification.read ? "text-gray-500" : "text-gray-700")}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications found</h3>
                <p className="text-gray-400">You're all caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
