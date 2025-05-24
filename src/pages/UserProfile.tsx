
import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit, Camera, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Emily Johnson",
    email: "emily.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    year: "3rd Year",
    studentId: "CS2021001",
    bio: "Passionate computer science student interested in AI and machine learning. Love participating in hackathons and tech workshops.",
    avatar: "/api/placeholder/120/120"
  });

  const stats = {
    eventsRegistered: 24,
    eventsAttended: 20,
    certificatesEarned: 8,
    networkingPoints: 1250
  };

  const recentEvents = [
    {
      id: 1,
      name: "AI & Machine Learning Workshop",
      date: "2024-05-20",
      status: "completed",
      certificate: true
    },
    {
      id: 2,
      name: "Cultural Night 2024",
      date: "2024-05-15",
      status: "completed",
      certificate: false
    },
    {
      id: 3,
      name: "Tech Symposium",
      date: "2024-06-10",
      status: "upcoming",
      certificate: false
    },
    {
      id: 4,
      name: "Career Guidance Seminar",
      date: "2024-06-15",
      status: "registered",
      certificate: false
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Event Enthusiast",
      description: "Attended 20+ events",
      icon: "🏆",
      earned: true
    },
    {
      id: 2,
      title: "Early Bird",
      description: "Registered for 10 events within first hour",
      icon: "🐦",
      earned: true
    },
    {
      id: 3,
      title: "Networking Pro",
      description: "Connected with 50+ participants",
      icon: "🤝",
      earned: false
    },
    {
      id: 4,
      title: "Certificate Collector",
      description: "Earned 10+ certificates",
      icon: "📜",
      earned: false
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      upcoming: "bg-blue-100 text-blue-800",
      registered: "bg-purple-100 text-purple-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your profile information and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="text-center pb-3">
                <div className="relative mx-auto">
                  <Avatar className="w-32 h-32 ring-4 ring-white/50 shadow-lg">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="text-center font-semibold"
                      />
                    ) : (
                      <CardTitle className="text-xl">{profile.name}</CardTitle>
                    )}
                    <CardDescription className="mt-1">Student ID: {profile.studentId}</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="ml-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-1 ml-2">
                      <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="flex-1"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-green-500" />
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="flex-1"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    {isEditing ? (
                      <Input
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="flex-1"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{profile.department}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{profile.year}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Profile Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.eventsRegistered}</p>
                    <p className="text-indigo-100 text-sm">Events Registered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.eventsAttended}</p>
                    <p className="text-indigo-100 text-sm">Events Attended</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.certificatesEarned}</p>
                    <p className="text-indigo-100 text-sm">Certificates</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.networkingPoints}</p>
                    <p className="text-indigo-100 text-sm">Network Points</p>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-indigo-100">Completion Rate</span>
                    <span>{Math.round((stats.eventsAttended / stats.eventsRegistered) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(stats.eventsAttended / stats.eventsRegistered) * 100} 
                    className="bg-white/20" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Events & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Events */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Recent Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.name}</h4>
                          <p className="text-sm text-gray-500">{event.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        {event.certificate && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Certificate
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200",
                        achievement.earned
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-sm"
                          : "bg-gray-50/50 border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                          achievement.earned ? "bg-yellow-100" : "bg-gray-100 grayscale"
                        )}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className={cn(
                            "font-semibold",
                            achievement.earned ? "text-gray-900" : "text-gray-500"
                          )}>
                            {achievement.title}
                          </h4>
                          <p className={cn(
                            "text-sm",
                            achievement.earned ? "text-gray-600" : "text-gray-400"
                          )}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
