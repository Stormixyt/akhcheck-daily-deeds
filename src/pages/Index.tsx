import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { FriendsList } from "@/components/FriendsList";
import { MotivationalCarousel } from "@/components/MotivationalCarousel";
import { DailyChallenge } from "@/components/DailyChallenge";
import { PrayerTimes } from "@/components/PrayerTimes";
import { UpdateLogDialog } from "@/components/UpdateLogDialog";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  const [userStreak, setUserStreak] = useState(0);
  const [todayStatus, setTodayStatus] = useState<"gooned" | "disciplined" | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load user's streak and today's status on mount
  useEffect(() => {
    if (user) {
      loadUserStreak();
      checkTodayStatus();
    }
  }, [user]);

  const loadUserStreak = async () => {
    if (!user) return;
    
    try {
      // Get all check-ins for this user, ordered by date
      const { data: checkIns, error } = await supabase
        .from('daily_check_ins')
        .select('status, check_date')
        .eq('user_id', user.id)
        .is('group_id', null) // Only personal check-ins
        .order('check_date', { ascending: false });

      if (error) throw error;

      // Calculate streak from consecutive "failed" (disciplined) days
      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      
      if (checkIns && checkIns.length > 0) {
        // Start from yesterday (if no check-in today) or today
        let currentDate = new Date();
        const todayCheckIn = checkIns.find(c => c.check_date === today);
        
        if (!todayCheckIn) {
          // If no check-in today, start counting from yesterday
          currentDate.setDate(currentDate.getDate() - 1);
        }

        // Count consecutive disciplined days
        for (const checkIn of checkIns) {
          const checkDate = currentDate.toISOString().split('T')[0];
          
          if (checkIn.check_date === checkDate && checkIn.status === 'disciplined') {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      setUserStreak(streak);
    } catch (error) {
      console.error('Error loading user streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayStatus = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_check_ins')
        .select('status')
        .eq('user_id', user.id)
        .eq('check_date', today)
        .is('group_id', null) // Only personal check-ins
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTodayStatus(data.status as "gooned" | "disciplined");
      }
    } catch (error) {
      console.error('Error checking today status:', error);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth-choice", { replace: true });
      return;
    }

    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate("/onboarding", { replace: true });
      return;
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  if (authLoading || profileLoading || loading) {
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

  const handleStatusUpdate = async (status: "gooned" | "disciplined") => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Save to database
      const { error } = await supabase
        .from('daily_check_ins')
        .insert({
          user_id: user.id,
          status,
          check_date: today,
          group_id: null // Personal check-in, not group
        });

      if (error) throw error;

      setTodayStatus(status);
      
      if (status === "disciplined") {
        // Increment streak
        const newStreak = userStreak + 1;
        setUserStreak(newStreak);
        toast({
          title: "Alhamdulillah! 🤲",
          description: "Your streak continues! Keep it up, akhi.",
          className: "bg-success text-success-foreground border-success",
        });
      } else {
        // Reset streak to 0
        setUserStreak(0);
        toast({
          title: "Don't give up 💚",
          description: "Tomorrow is a new chance. Make tawbah and restart.",
          className: "bg-destructive text-destructive-foreground border-destructive",
        });
      }
    } catch (error: any) {
      console.error('Error saving check-in:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: error.message || "Failed to save your check-in. Please try again.",
        variant: "destructive",
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

        {/* Prayer Times */}
        <div className="animate-slide-in-right stagger-4">
          <PrayerTimes />
        </div>

        {/* Daily challenge */}
        <div className="animate-slide-in-right stagger-5">
          <DailyChallenge />
        </div>


        {/* Daily reminder */}
        <div className="text-center p-6 glass-card rounded-3xl glow-primary hover-lift animate-smooth animate-slide-in-right stagger-6">
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
