import { ArrowLeft, Bell, CheckCircle, XCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";

// Enhanced notification data with Islamic motivation
const notifications = [
  {
    id: "1",
    type: "friend_update",
    message: "Omar heeft vandaag stayed clean 💪",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-success",
    unread: true
  },
  {
    id: "2", 
    type: "streak_milestone",
    message: "Je streak is nu 7 dagen! 🔥",
    time: "1 day ago",
    icon: Target,
    color: "text-warning",
    unread: true
  },
  {
    id: "3",
    type: "daily_challenge",
    message: "Vandaag's uitdaging: Bid op tijd ⏰",
    time: "1 day ago",
    icon: Bell,
    color: "text-primary",
    unread: true
  },
  {
    id: "4",
    type: "friend_boost",
    message: "Ahmed heeft je een boost gestuurd: 'Stay strong, akhi!'",
    time: "2 days ago",
    icon: Target,
    color: "text-warning",
    unread: false
  },
  {
    id: "5",
    type: "verse_reminder",
    message: "Nieuwe verse: 'Don't expose your sins' - Sahih al-Bukhari",
    time: "3 days ago",
    icon: Bell,
    color: "text-primary",
    unread: false
  },
  {
    id: "6",
    type: "goal_completed",
    message: "Dagelijkse doelen voltooid! Alle 5 gebeden gedaan 🤲",
    time: "4 days ago",
    icon: CheckCircle,
    color: "text-success",
    unread: false
  },
  {
    id: "7",
    type: "motivation",
    message: "Reminder: 'Discipline beats motivation elke dag'",
    time: "5 days ago",
    icon: Target,
    color: "text-warning",
    unread: false
  }
];

export const Notifications = () => {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Notification Stats */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">Total notifications</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </div>
        </GlassCard>

        {/* Notifications List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          
          {notifications.map((notification, index) => {
            const IconComponent = notification.icon;
            return (
              <GlassCard 
                key={notification.id} 
                className="p-4 cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => {
                  // Navigate based on notification type
                  if (notification.type === "friend_update" || notification.type === "friend_boost") {
                    navigate("/");
                  } else if (notification.type === "goal_completed") {
                    navigate("/settings");
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${notification.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-foreground font-medium text-sm leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                  
                  {notification.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Clear All Button */}
        <div className="pt-4">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </div>
      </main>
    </div>
  );
};