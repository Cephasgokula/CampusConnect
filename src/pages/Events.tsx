
import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const events = [
    {
      id: 1,
      title: "Tech Workshop: React Fundamentals",
      description: "Learn the basics of React.js and build your first interactive web application.",
      date: "2024-05-30",
      time: "10:00 AM",
      venue: "Computer Lab A",
      category: "Workshop",
      registrations: 24,
      capacity: 30,
      status: "open",
      organizer: "Computer Science Department"
    },
    {
      id: 2,
      title: "Cultural Night 2024",
      description: "Annual cultural celebration featuring performances, music, and traditional food.",
      date: "2024-06-05",
      time: "6:00 PM",
      venue: "Main Auditorium",
      category: "Cultural",
      registrations: 156,
      capacity: 200,
      status: "open",
      organizer: "Student Activities Committee"
    },
    {
      id: 3,
      title: "Career Guidance Seminar",
      description: "Professional guidance session with industry experts on career planning.",
      date: "2024-06-10",
      time: "2:00 PM",
      venue: "Seminar Hall B",
      category: "Seminar",
      registrations: 45,
      capacity: 50,
      status: "open",
      organizer: "Placement Cell"
    },
    {
      id: 4,
      title: "Inter-College Sports Meet",
      description: "Annual sports competition with various indoor and outdoor games.",
      date: "2024-06-15",
      time: "9:00 AM",
      venue: "Sports Complex",
      category: "Sports",
      registrations: 78,
      capacity: 100,
      status: "open",
      organizer: "Sports Department"
    },
    {
      id: 5,
      title: "AI & Machine Learning Workshop",
      description: "Advanced workshop on artificial intelligence and machine learning concepts.",
      date: "2024-06-20",
      time: "11:00 AM",
      venue: "Computer Lab B",
      category: "Workshop",
      registrations: 35,
      capacity: 40,
      status: "open",
      organizer: "IT Department"
    },
    {
      id: 6,
      title: "Environmental Awareness Campaign",
      description: "Educational event focused on environmental conservation and sustainability.",
      date: "2024-06-25",
      time: "3:00 PM",
      venue: "Open Ground",
      category: "Social",
      registrations: 62,
      capacity: 80,
      status: "open",
      organizer: "Environmental Club"
    }
  ];

  const categories = ["all", "Workshop", "Cultural", "Seminar", "Sports", "Social"];
  const statuses = ["all", "open", "closed", "cancelled"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
            <p className="text-gray-600">Discover and manage all campus events</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                    <span>{event.registrations}/{event.capacity} registered</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  Organized by: {event.organizer}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
