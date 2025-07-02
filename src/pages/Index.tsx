import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { FriendsList } from "@/components/FriendsList";
import { MotivationalCarousel } from "@/components/MotivationalCarousel";
import { DailyChallenge } from "@/components/DailyChallenge";
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
    <div className="min-h-screen bg-background">
      <Header username={profile?.display_name || "Abdullah"} />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Daily motivation carousel */}
        <MotivationalCarousel />

        {/* User's own status */}
        <StatusCard
          username="You"
          streak={userStreak}
          todayStatus={todayStatus}
          onStatusUpdate={handleStatusUpdate}
          isOwnProfile={true}
        />

        {/* Daily challenge */}
        <DailyChallenge />

        {/* Friends list */}
        <FriendsList friends={dummyFriends} />

        {/* Daily reminder */}
        <div className="text-center p-4 glass-card rounded-lg">
          <p className="text-sm text-muted-foreground">
            "And whoever fears Allah - He will make for him a way out."
          </p>
          <p className="text-xs text-primary mt-1">— Quran 65:2</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
