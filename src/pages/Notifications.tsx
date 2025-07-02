import { ArrowLeft, Bell, CheckCircle, XCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";

// Dummy notification data
const notifications = [
  {
    id: "1",
    type: "friend_update",
    message: "Omar heeft vandaag gegooned 💪",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-success"
  },
  {
    id: "2", 
    type: "streak_broken",
    message: "Streak gebroken op dag 4 💀",
    time: "1 day ago",
    icon: XCircle,
    color: "text-destructive"
  },
  {
    id: "3",
    type: "verse_added",
    message: "Nieuwe Quran-vers toegevoegd: Geduld",
    time: "2 days ago",
    icon: Bell,
    color: "text-primary"
  },
  {
    id: "4",
    type: "friend_boost",
    message: "Ahmed heeft je een boost gestuurd",
    time: "3 days ago",
    icon: Target,
    color: "text-warning"
  },
  {
    id: "5",
    type: "goal_completed",
    message: "Dagelijkse doelen voltooid! 🎯",
    time: "4 days ago",
    icon: CheckCircle,
    color: "text-success"
  }
];

export const Notifications = () => {
  const navigate = useNavigate();

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
              <p className="text-lg font-semibold text-primary">3</p>
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
                  
                  {index < 3 && (
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