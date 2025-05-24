
import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, BookOpen, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Workshop: React Fundamentals",
      date: "2024-05-30",
      time: "10:00 AM",
      venue: "Computer Lab A",
      category: "Workshop",
      registered: false,
      spotsLeft: 6
    },
    {
      id: 2,
      title: "Cultural Night 2024",
      date: "2024-06-05",
      time: "6:00 PM",
      venue: "Main Auditorium",
      category: "Cultural",
      registered: false,
      spotsLeft: 44
    },
    {
      id: 3,
      title: "Career Guidance Seminar",
      date: "2024-06-10",
      time: "2:00 PM",
      venue: "Seminar Hall B",
      category: "Seminar",
      registered: false,
      spotsLeft: 5
    }
  ];

  const registeredEvents = [
    {
      id: 4,
      title: "AI & Machine Learning Workshop",
      date: "2024-06-20",
      time: "11:00 AM",
      venue: "Computer Lab B",
      category: "Workshop",
      status: "confirmed",
      reminder: true
    },
    {
      id: 5,
      title: "Environmental Awareness Campaign",
      date: "2024-06-25",
      time: "3:00 PM",
      venue: "Open Ground",
      category: "Social",
      status: "confirmed",
      reminder: false
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Event Reminder",
      message: "AI & Machine Learning Workshop starts in 2 days",
      time: "2 hours ago",
      type: "reminder"
    },
    {
      id: 2,
      title: "New Event Added",
      message: "Photography Workshop has been added to upcoming events",
      time: "1 day ago",
      type: "new"
    },
    {
      id: 3,
      title: "Venue Change",
      message: "Environmental Campaign venue changed to Main Ground",
      time: "2 days ago",
      type: "update"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Workshop: "bg-blue-100 text-blue-800",
      Cultural: "bg-purple-100 text-purple-800",
      Seminar: "bg-green-100 text-green-800",
      Sports: "bg-orange-100 text-orange-800",
      Social: "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return "🔔";
      case "new":
        return "✨";
      case "update":
        return "📝";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
          <p className="text-gray-600">Welcome back! Discover and register for campus events.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Registered Events</p>
                  <p className="text-3xl font-bold text-gray-900">{registeredEvents.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-3xl font-bold text-gray-900">{upcomingEvents.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Available Events</TabsTrigger>
                <TabsTrigger value="registered">My Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-6">
                <div className="grid gap-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                          <div className="text-sm text-gray-500">
                            {event.spotsLeft} spots left
                          </div>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.spotsLeft > 0 ? "Available" : "Full"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            disabled={event.spotsLeft === 0}
                          >
                            {event.spotsLeft === 0 ? "Full" : "Register"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="registered" className="space-y-6">
                <div className="grid gap-6">
                  {registeredEvents.map((event) => (
                    <Card key={event.id} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {event.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <span>{event.reminder ? "Reminders On" : "Reminders Off"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            {event.reminder ? "Turn Off Reminders" : "Turn On Reminders"}
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1">
                            Cancel Registration
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Browse All Events
                </Button>
                <Button className="w-full" variant="outline">
                  Event Calendar View
                </Button>
                <Button className="w-full" variant="outline">
                  Notification Settings
                </Button>
                <Button className="w-full" variant="outline">
                  Download My Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
