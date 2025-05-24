
import React from "react";
import { Calendar, Users, MapPin, Clock, TrendingUp, Award, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Workshop: React Fundamentals",
      description: "Deep dive into modern React development with hands-on exercises",
      date: "2024-05-30",
      time: "10:00 AM",
      venue: "Computer Lab A",
      category: "Workshop",
      registrations: 24,
      capacity: 30,
      status: "open",
      organizer: "CS Department"
    },
    {
      id: 2,
      title: "Cultural Night 2024",
      description: "Celebrate diversity with performances from around the world",
      date: "2024-06-05",
      time: "6:00 PM",
      venue: "Main Auditorium",
      category: "Cultural",
      registrations: 156,
      capacity: 200,
      status: "open",
      organizer: "Student Union"
    },
    {
      id: 3,
      title: "Career Guidance Seminar",
      description: "Expert insights on career planning and industry trends",
      date: "2024-06-10",
      time: "2:00 PM",
      venue: "Seminar Hall B",
      category: "Seminar",
      registrations: 45,
      capacity: 50,
      status: "open",
      organizer: "Career Center"
    }
  ];

  const stats = [
    { 
      title: "Total Events", 
      value: "15", 
      icon: Calendar, 
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      change: "+12%"
    },
    { 
      title: "Registered Students", 
      value: "234", 
      icon: Users, 
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      change: "+23%"
    },
    { 
      title: "This Month", 
      value: "8", 
      icon: TrendingUp, 
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      change: "+8%"
    },
    { 
      title: "Active Venues", 
      value: "12", 
      icon: MapPin, 
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      change: "+5%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6 shadow-elegant">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Campus Event Management</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              Event Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and track all campus events with powerful insights and real-time analytics
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-elegant hover:shadow-elegant-hover transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <div className={`absolute inset-0 ${stat.bgColor} opacity-50`}></div>
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <TrendingUp className="h-4 w-4" />
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center gap-1">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">Create Event</span>
                </div>
              </Button>
              <Button variant="outline" className="h-16 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                <div className="flex flex-col items-center gap-1">
                  <Users className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  <span className="text-sm font-medium">View Events</span>
                </div>
              </Button>
              <Button variant="outline" className="h-16 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 group">
                <div className="flex flex-col items-center gap-1">
                  <MapPin className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
                  <span className="text-sm font-medium">Manage Venues</span>
                </div>
              </Button>
              <Button variant="outline" className="h-16 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 group">
                <div className="flex flex-col items-center gap-1">
                  <Clock className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
                  <span className="text-sm font-medium">Send Notifications</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Enhanced Upcoming Events */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <Card key={event.id} className="group relative overflow-hidden border-0 shadow-elegant hover:shadow-elegant-hover transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 shadow-sm">
                        {event.category}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0 shadow-sm">
                        {event.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                          <span className="text-sm font-bold text-blue-600">
                            {event.registrations}/{event.capacity}
                          </span>
                        </div>
                        <Progress 
                          value={(event.registrations / event.capacity) * 100} 
                          className="h-2 bg-white"
                        />
                        <div className="text-xs text-gray-600 mt-1">
                          {event.capacity - event.registrations} spots remaining
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Organized by: <span className="font-medium">{event.organizer}</span>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" variant="outline" className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
