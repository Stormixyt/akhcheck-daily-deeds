import { useState } from "react";
import { ArrowLeft, User, Bell, Target, Palette, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, preferences, goals, updatePreferences, addGoal, toggleGoal, deleteGoal, loading } = useUserData();
  const [newGoal, setNewGoal] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleAddGoal = async () => {
    if (newGoal.trim()) {
      await addGoal(newGoal.trim());
      setNewGoal("");
    }
  };

  const timeOptions = [
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", 
    "21:00", "21:30", "22:00", "22:30", "23:00"
  ];

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
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
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Section */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-medium text-foreground">{profile?.display_name || "Abdullah"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </Button>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Anonymous Mode</p>
                <p className="text-sm text-muted-foreground">Hide your status from friends</p>
              </div>
              <Switch 
                checked={preferences?.anonymous_mode || false}
                onCheckedChange={(checked) => {
                  updatePreferences({ anonymous_mode: checked });
                }}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Repeat Warnings</p>
                <p className="text-sm text-muted-foreground">Show sin warning every time</p>
              </div>
              <Switch 
                checked={preferences?.repeat_warnings || false}
                onCheckedChange={(checked) => {
                  updatePreferences({ repeat_warnings: checked });
                }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Notifications Section */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Reminder</p>
                <p className="text-sm text-muted-foreground">Get reminded to check in</p>
              </div>
              <Switch 
                checked={preferences?.daily_reminder || false}
                onCheckedChange={(checked) => {
                  updatePreferences({ daily_reminder: checked });
                }}
              />
            </div>
            
            {preferences?.daily_reminder && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reminder Time
                </label>
                <select
                  value={preferences?.reminder_time || "21:00"}
                  onChange={(e) => updatePreferences({ reminder_time: e.target.value })}
                  className="w-full p-2 bg-input border border-border rounded-md text-foreground"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Goals Section */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Daily Goals</h2>
          </div>
          
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                <span className="text-foreground flex-1">{goal.name}</span>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={goal.completed}
                    onCheckedChange={(checked) => toggleGoal(goal.id, checked)}
                  />
                  {!goal.is_default && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGoal(goal.id)}
                      className="w-8 h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Input
                placeholder="Add custom goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                className="flex-1"
              />
              <Button onClick={handleAddGoal} disabled={!newGoal.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Theme Section */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Theme</h2>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {(['green', 'blue', 'purple'] as const).map((theme) => (
                <div 
                  key={theme}
                  className={`p-3 rounded-lg text-center cursor-pointer transition-colors ${
                    preferences?.theme === theme 
                      ? 'bg-primary/30 border-2 border-primary' 
                      : 'bg-accent/20 hover:bg-accent/30'
                  }`}
                  onClick={() => updatePreferences({ theme })}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${
                    theme === 'green' ? 'bg-green-500' :
                    theme === 'blue' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-xs text-foreground capitalize">{theme}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};