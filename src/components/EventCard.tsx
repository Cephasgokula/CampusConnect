import React from "react";
import { Calendar, Clock, MapPin, Users, Star, Zap, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  registrations?: number;
  capacity?: number;
  status: string;
  organizer?: string;
}

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: number) => void;
  onView?: (eventId: number) => void;
  isRegistered?: boolean;
  showRegisterButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onRegister, 
  onView, 
  isRegistered = false,
  showRegisterButton = true 
}) => {
  const getCategoryConfig = (category: string) => {
    const configs = {
      Workshop: { 
        gradient: "from-blue-500 to-cyan-500", 
        bg: "from-blue-50 to-cyan-50",
        icon: Zap
      },
      Cultural: { 
        gradient: "from-purple-500 to-pink-500", 
        bg: "from-purple-50 to-pink-50",
        icon: Star
      },
      Seminar: { 
        gradient: "from-green-500 to-emerald-500", 
        bg: "from-green-50 to-emerald-50",
        icon: Award
      },
      Sports: { 
        gradient: "from-orange-500 to-red-500", 
        bg: "from-orange-50 to-red-50",
        icon: Zap
      },
      Social: { 
        gradient: "from-pink-500 to-rose-500", 
        bg: "from-pink-50 to-rose-50",
        icon: Users
      }
    };
    return configs[category as keyof typeof configs] || configs.Workshop;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      open: { gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50" },
      closed: { gradient: "from-red-500 to-rose-500", bg: "from-red-50 to-rose-50" },
      cancelled: { gradient: "from-gray-500 to-slate-500", bg: "from-gray-50 to-slate-50" },
      confirmed: { gradient: "from-blue-500 to-indigo-500", bg: "from-blue-50 to-indigo-50" }
    };
    return configs[status as keyof typeof configs] || configs.open;
  };

  const categoryConfig = getCategoryConfig(event.category);
  const statusConfig = getStatusConfig(event.status);
  const CategoryIcon = categoryConfig.icon;

  const spotsLeft = event.capacity && event.registrations 
    ? event.capacity - event.registrations 
    : null;

  const progressPercentage = event.capacity && event.registrations 
    ? (event.registrations / event.capacity) * 100 
    : 0;

  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 shadow-elegant hover:shadow-elegant-hover transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm",
      isRegistered ? 'ring-2 ring-green-200 shadow-green-100' : ''
    )}>
      {/* Gradient top border */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${categoryConfig.gradient}`}></div>
      
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${categoryConfig.bg} opacity-30 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`}></div>
      
      {isRegistered && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}

      <CardHeader className="pb-3 relative z-10">
        <div className="flex justify-between items-start mb-3">
          <Badge className={`bg-gradient-to-r ${categoryConfig.bg} border-0 shadow-sm flex items-center gap-1.5 px-3 py-1.5`}>
            <CategoryIcon className="w-3 h-3" />
            <span className={`text-transparent bg-gradient-to-r ${categoryConfig.gradient} bg-clip-text font-semibold`}>
              {event.category}
            </span>
          </Badge>
          <Badge className={`bg-gradient-to-r ${statusConfig.bg} border-0 shadow-sm px-3 py-1.5`}>
            <span className={`text-transparent bg-gradient-to-r ${statusConfig.gradient} bg-clip-text font-semibold`}>
              {event.status}
            </span>
          </Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {event.title}
        </CardTitle>
        {event.description && (
          <CardDescription className="line-clamp-2 text-gray-600">
            {event.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-100/50">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm">
              <Calendar className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-gray-700">{event.date}</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-100/50">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm">
              <Clock className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-gray-700">{event.time}</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/80 to-pink-50/80 border border-purple-100/50">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-gray-700">{event.venue}</span>
          </div>

          {event.registrations !== undefined && event.capacity !== undefined && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm">
                    <Users className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                </div>
                <span className="text-sm font-bold text-indigo-600">
                  {event.registrations}/{event.capacity}
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2.5 bg-white/80 shadow-inner"
              />
              {spotsLeft !== null && spotsLeft > 0 ? (
                <div className="text-xs text-emerald-600 mt-2 font-medium">
                  ✨ {spotsLeft} spots remaining
                </div>
              ) : spotsLeft === 0 ? (
                <div className="text-xs text-red-600 mt-2 font-medium">
                  🔥 Event is full
                </div>
              ) : null}
            </div>
          )}
        </div>
        
        {event.organizer && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 p-2 rounded-lg bg-gray-50/80">
            <Users className="h-3 w-3" />
            <span>Organized by: <span className="font-medium text-gray-700">{event.organizer}</span></span>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 group"
            onClick={() => onView?.(event.id)}
          >
            <span className="group-hover:scale-105 transition-transform duration-300">View Details</span>
          </Button>
          {showRegisterButton && (
            <Button 
              size="sm" 
              className={cn(
                "flex-1 shadow-md hover:shadow-lg transition-all duration-300 group",
                isRegistered 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                  : spotsLeft === 0 
                    ? "bg-gradient-to-r from-gray-400 to-gray-500"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              )}
              onClick={() => onRegister?.(event.id)}
              disabled={spotsLeft === 0 || isRegistered}
            >
              <span className="group-hover:scale-105 transition-transform duration-300">
                {isRegistered ? "✓ Registered" : spotsLeft === 0 ? "Full" : "Register"}
              </span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
