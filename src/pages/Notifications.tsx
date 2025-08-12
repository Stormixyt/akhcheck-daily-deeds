
import { ArrowLeft, Bell, CheckCircle, XCircle, Target, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useTranslation } from "@/hooks/useTranslation";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'friend_update':
    case 'group_checkin':
      return CheckCircle;
    case 'streak_milestone':
      return Flame;
    case 'daily_challenge':
    case 'verse_reminder':
      return Bell;
    case 'friend_boost':
    case 'motivation':
      return Target;
    case 'goal_completed':
      return CheckCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'friend_update':
    case 'group_checkin':
    case 'goal_completed':
      return "text-success";
    case 'streak_milestone':
      return "text-warning";
    case 'daily_challenge':
    case 'verse_reminder':
      return "text-primary";
    case 'friend_boost':
    case 'motivation':
      return "text-warning";
    default:
      return "text-primary";
  }
};

export const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { notifications, loading } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('just_now');
    if (diffInHours < 24) return `${diffInHours} ${t('hours_ago')}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t('days_ago')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">{t('loading')}</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold text-foreground">{t('notifications')}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Notification Stats */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">{t('total_notifications')}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">{t('unread')}</p>
            </div>
          </div>
        </GlassCard>

        {/* Notifications List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t('recent_activity')}</h2>
          
          {notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);
            
            return (
              <GlassCard 
                key={notification.id} 
                className="p-4 cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => {
                  // Navigate based on notification type
                  if (notification.type === "friend_update" || notification.type === "friend_boost" || notification.type === "group_checkin") {
                    navigate("/");
                  } else if (notification.type === "goal_completed") {
                    navigate("/settings");
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${iconColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-foreground font-medium text-sm leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                  
                  {!notification.read && (
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
            {t('mark_all_read')}
          </Button>
        </div>
      </main>
    </div>
  );
};
