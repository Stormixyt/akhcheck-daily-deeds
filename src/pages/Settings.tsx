import { useState } from "react";
import { ArrowLeft, User, Bell, Target, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const navigate = useNavigate();
  const [anonMode, setAnonMode] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("21:00");

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
          <div className="w-10" /> {/* Spacer */}
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
              <p className="font-medium text-foreground">Abdullah</p>
              <p className="text-sm text-muted-foreground">abdullah@example.com</p>
            </div>
            
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Anonymous Mode</p>
                <p className="text-sm text-muted-foreground">Hide your status from friends</p>
              </div>
              <Switch 
                checked={anonMode}
                onCheckedChange={(checked) => {
                  setAnonMode(checked);
                  localStorage.setItem('akhcheck-anonymous-mode', checked.toString());
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
                checked={localStorage.getItem('akhcheck-repeat-warnings') === 'true'}
                onCheckedChange={(checked) => {
                  localStorage.setItem('akhcheck-repeat-warnings', checked.toString());
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
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />
            </div>
            
            {dailyReminder && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full p-2 bg-input border border-border rounded-md text-foreground"
                />
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
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <span className="text-foreground">5x Daily Prayers</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <span className="text-foreground">1 Hour Learning</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <span className="text-foreground">20min Exercise</span>
              <Switch />
            </div>
            
            <Button variant="outline" className="w-full mt-3">
              Add Custom Goal
            </Button>
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
              <div className="p-3 bg-success/20 rounded-lg text-center cursor-pointer hover:bg-success/30 transition-colors">
                <div className="w-6 h-6 bg-success rounded-full mx-auto mb-1"></div>
                <span className="text-xs text-foreground">Green</span>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg text-center cursor-pointer hover:bg-blue-500/30 transition-colors">
                <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <span className="text-xs text-foreground">Blue</span>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg text-center cursor-pointer hover:bg-purple-500/30 transition-colors">
                <div className="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-1"></div>
                <span className="text-xs text-foreground">Purple</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};