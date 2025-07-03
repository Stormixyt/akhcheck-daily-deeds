import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { FriendsList } from "@/components/FriendsList";
import { MotivationalCarousel } from "@/components/MotivationalCarousel";
import { DailyChallenge } from "@/components/DailyChallenge";
import { UpdateLogDialog } from "@/components/UpdateLogDialog";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";

// Dummy data for testing
const dummyFriends = [
  {
    id: "1",
    username: "Ahmed_92",
    streak: 7,
    todayStatus: "failed" as const
  },
  {
    id: "2", 
    username: "Yusuf_H",
    streak: 0,
    todayStatus: "gooned" as const
  },
  {
    id: "3",
    username: "Omar_Akhi",
    streak: 12,
    todayStatus: null
  }
];

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  const navigate = useNavigate();
  const [userStreak, setUserStreak] = useState(5);
  const [todayStatus, setTodayStatus] = useState<"gooned" | "failed" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth-choice");
      return;
    }

    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
      return;
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleStatusUpdate = (status: "gooned" | "failed") => {
    setTodayStatus(status);
    
    if (status === "failed") {
      setUserStreak(userStreak + 1);
      toast({
        title: "Alhamdulillah! 🤲",
        description: "Your streak continues! Keep it up, akhi.",
        className: "bg-success text-success-foreground border-success",
      });
    } else {
      setUserStreak(0);
      toast({
        title: "Don't give up 💚",
        description: "Tomorrow is a new chance. Make tawbah and restart.",
        className: "bg-destructive text-destructive-foreground border-destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <UpdateLogDialog />
      <Header username={profile?.display_name || "Abdullah"} />
      
      <main className="max-w-sm mx-auto p-6 space-y-8">
        {/* Daily motivation carousel */}
        <div className="animate-fade-in-up stagger-1">
          <MotivationalCarousel />
        </div>

        {/* User's own status */}
        <div className="animate-slide-in-right stagger-2">
          <StatusCard
            username="You"
            streak={userStreak}
            todayStatus={todayStatus}
            onStatusUpdate={handleStatusUpdate}
            isOwnProfile={true}
          />
        </div>

        {/* Daily challenge */}
        <div className="animate-slide-in-right stagger-3">
          <DailyChallenge />
        </div>

        {/* My Brothers section with verses */}
        <div className="animate-slide-in-right stagger-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <span className="mr-2">👥</span>
              My Brothers
            </h3>
            <div className="space-y-3">
              <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground italic">
                  "The believers in their mutual kindness, compassion, and sympathy are just one body..."
                </p>
                <p className="text-xs text-accent font-semibold mt-1">— Sahih al-Bukhari</p>
              </div>
              <FriendsList friends={dummyFriends} />
            </div>
          </GlassCard>
        </div>

        {/* Daily reminder */}
        <div className="text-center p-6 glass-card rounded-3xl glow-primary hover-lift animate-smooth animate-slide-in-right stagger-5">
          <p className="text-base text-muted-foreground leading-relaxed mb-3">
            "And whoever fears Allah - He will make for him a way out."
          </p>
          <p className="text-sm text-primary font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            — Quran 65:2
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
