import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { QuranDialog } from "./QuranDialog";

interface StatusCardProps {
  username: string;
  streak: number;
  todayStatus: "gooned" | "failed" | null;
  onStatusUpdate: (status: "gooned" | "failed") => void;
  isOwnProfile?: boolean;
}

export const StatusCard = ({ 
  username, 
  streak, 
  todayStatus, 
  onStatusUpdate, 
  isOwnProfile = false 
}: StatusCardProps) => {
  const [showQuranDialog, setShowQuranDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"gooned" | "failed" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStatusClick = (status: "gooned" | "failed") => {
    if (!isOwnProfile) return;
    
    setSelectedStatus(status);
    setShowQuranDialog(true);
    onStatusUpdate(status);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getStatusIcon = () => {
    if (todayStatus === "failed") {
      return <CheckCircle className="w-8 h-8 text-success" />;
    } else if (todayStatus === "gooned") {
      return <XCircle className="w-8 h-8 text-destructive" />;
    }
    return null;
  };

  return (
    <>
      <GlassCard className={`p-6 transition-all duration-300 ${isAnimating ? 'confetti-animation' : ''}`}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <h3 className="text-xl font-semibold text-foreground">{username}</h3>
            {getStatusIcon()}
          </div>
          
          <div className="text-3xl font-bold text-primary">
            {streak} day{streak !== 1 ? 's' : ''} streak
          </div>

          {isOwnProfile && !todayStatus && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">How did you do today?</p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleStatusClick("failed")}
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground glow-success"
                  size="lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Stayed Clean ✅
                </Button>
                <Button
                  onClick={() => handleStatusClick("gooned")}
                  variant="destructive"
                  className="flex-1"
                  size="lg"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Gooned ❌
                </Button>
              </div>
            </div>
          )}

          {isOwnProfile && todayStatus && (
            <div className="text-sm text-muted-foreground">
              Status updated for today!
            </div>
          )}
        </div>
      </GlassCard>

      <QuranDialog
        open={showQuranDialog}
        onOpenChange={setShowQuranDialog}
        status={selectedStatus}
      />
    </>
  );
};