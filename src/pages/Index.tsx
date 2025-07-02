import { useState } from "react";
import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { FriendsList } from "@/components/FriendsList";
import { useToast } from "@/hooks/use-toast";

// Dummy data for testing
const dummyFriends = [
  {
    id: "1",
    username: "Ahmed_92",
    streak: 7,
    todayStatus: "gooned" as const
  },
  {
    id: "2", 
    username: "Yusuf_H",
    streak: 3,
    todayStatus: "failed" as const
  },
  {
    id: "3",
    username: "Omar_Akhi",
    streak: 12,
    todayStatus: null
  }
];

const Index = () => {
  const [userStreak, setUserStreak] = useState(5);
  const [todayStatus, setTodayStatus] = useState<"gooned" | "failed" | null>(null);
  const { toast } = useToast();

  const handleStatusUpdate = (status: "gooned" | "failed") => {
    setTodayStatus(status);
    
    if (status === "gooned") {
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
      <Header username="Abdullah" />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* User's own status */}
        <StatusCard
          username="You"
          streak={userStreak}
          todayStatus={todayStatus}
          onStatusUpdate={handleStatusUpdate}
          isOwnProfile={true}
        />

        {/* Friends list */}
        <FriendsList friends={dummyFriends} />

        {/* Daily reminder */}
        <div className="text-center p-4 bg-accent/30 rounded-lg border border-border">
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
