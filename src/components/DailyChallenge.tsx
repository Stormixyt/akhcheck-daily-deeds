import { useState, useEffect } from "react";
import { Target, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

const dailyChallenges = [
  "Vandaag geen TikTok",
  "Bid vandaag op tijd, alle 5",
  "20 minuten wandelen",
  "Lees 1 pagina Quran",
  "Help iemand vandaag",
  "Geen junk food vandaag",
  "10 minuten dhikr",
  "Bel je ouders",
  "30 minuten leren"
];

export const DailyChallenge = () => {
  const [challenge, setChallenge] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Generate daily challenge based on date to ensure consistency
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`daily-challenge-${today}`);
    const completedStatus = localStorage.getItem(`challenge-completed-${today}`);
    
    if (saved) {
      setChallenge(saved);
      setIsCompleted(completedStatus === 'true');
    } else {
      const randomChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
      setChallenge(randomChallenge);
      localStorage.setItem(`daily-challenge-${today}`, randomChallenge);
    }
  }, []);

  const handleComplete = () => {
    const today = new Date().toDateString();
    setIsCompleted(true);
    localStorage.setItem(`challenge-completed-${today}`, 'true');
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-start space-x-3">
        <div className="mt-1">
          <Target className="w-5 h-5 text-warning" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-1">
            Daily Challenge
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            {challenge}
          </p>
          
          {!isCompleted ? (
            <Button
              onClick={handleComplete}
              size="sm"
              className="text-xs"
            >
              Mark Complete
            </Button>
          ) : (
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Completed! 🎉</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};