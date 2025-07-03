import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { Flame, Users, MessageCircle, Skull, Calendar, BookOpen, Palette, Settings } from "lucide-react";

export const UpdateLogDialog = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserData();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show dialog if user is logged in and hasn't seen v1.1 update
    if (user && preferences && !preferences.has_seen_v11_update) {
      setOpen(true);
    }
  }, [user, preferences]);

  const handleLockIn = async () => {
    if (preferences) {
      await updatePreferences({ has_seen_v11_update: true });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass-card border-primary/20 max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl modern-gradient animate-gradient flex items-center justify-center glow-primary">
            <Flame className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🔥 AkhCheck v1.1 – Brotherhood Update
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Stay updated and halal with your squad.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-foreground">
              <Users className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">✅ Introducing Groups</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground">
              <MessageCircle className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">🗣️ In-App Chat</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground">
              <Skull className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium">💀 Goon = FAIL (als je gooned, ben je cooked)</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground">
              <Calendar className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium">🔥 Daily Discipline Streaks</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">📖 Quran Verse Drops</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground">
              <Palette className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">🎨 Thema kleuren LIVE switch</span>
            </div>
            <div className="flex items-center space-x-3 text-foreground">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">⚙️ Instellingen gefixt</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleLockIn}
            className="w-full h-12 rounded-2xl text-base font-semibold modern-gradient animate-gradient glow-primary"
          >
            Let's Lock In 🔥
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};