import React, { useState } from "react";
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, MapPin, UserPlus, Download, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const users = [
    {
      id: 1,
      name: "Emily Johnson",
      email: "emily.johnson@university.edu",
      phone: "+1 (555) 123-4567",
      role: "Student",
      department: "Computer Science",
      year: "3rd Year",
      registeredEvents: 12,
      lastActive: "2 hours ago",
      status: "active",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "m.chen@university.edu",
      phone: "+1 (555) 234-5678",
      role: "Faculty",
      department: "Engineering",
      year: "Professor",
      registeredEvents: 8,
      lastActive: "1 day ago",
      status: "active",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 4,
      name: "James Rodriguez",
      email: "j.rodriguez@university.edu",
      phone: "+1 (555) 456-7890",
      role: "Student",
      department: "Business",
      year: "2nd Year",
      registeredEvents: 6,
      lastActive: "3 days ago",
      status: "inactive",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "l.thompson@university.edu",
      phone: "+1 (555) 567-8901",
      role: "Student",
      department: "Arts",
      year: "4th Year",
      registeredEvents: 18,
      lastActive: "1 hour ago",
      status: "active",
      avatar: "/api/placeholder/40/40"
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === "all" || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getRoleColor = (role: string) => {
    const colors = {
      Student: "bg-blue-100 text-blue-800",
      Faculty: "bg-purple-100 text-purple-800",
      Admin: "bg-green-100 text-green-800",
      Staff: "bg-orange-100 text-orange-800"
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                User Management
              </h1>
              <p className="text-gray-600">Manage all users and their permissions</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
              <Button variant="outline" className="shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Users</p>
                    <p className="text-3xl font-bold">{users.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <UsersIcon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Users</p>
                    <p className="text-3xl font-bold">{users.filter(u => u.status === "active").length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Students</p>
                    <p className="text-3xl font-bold">{users.filter(u => u.role === "Student").length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Faculty</p>
                    <p className="text-3xl font-bold">{users.filter(u => u.role === "Faculty").length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              {["all", "Student", "Faculty"].map((role) => (
                <Button
                  key={role}
                  variant={filterRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRole(role)}
                  className={cn(
                    "transition-all duration-200",
                    filterRole === role
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                      : "bg-white/50 backdrop-blur-sm hover:bg-white/80"
                  )}
                >
                  {role === "all" ? "All Users" : role}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 ring-4 ring-white/50">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white", getStatusColor(user.status))}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span>{user.department}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                        <span>Year: {user.year}</span>
                        <span>Events: {user.registeredEvents}</span>
                        <span>Last active: {user.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
