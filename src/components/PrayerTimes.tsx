import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Clock, MapPin, Sunrise, Sun, Sunset, Moon, Star } from "lucide-react";

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
  passed: boolean;
}

export const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<string>("Netherlands");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get user location and calculate prayer times
    const fetchPrayerTimes = async () => {
      try {
        // For demo purposes, using static times for Netherlands
        // In a real app, you'd use an API like Aladhan or calculate based on location
        const today = new Date();
        const times = [
          { name: "Fajr", time: "05:30", icon: <Sunrise className="w-4 h-4" />, passed: false },
          { name: "Dhuhr", time: "13:15", icon: <Sun className="w-4 h-4" />, passed: false },
          { name: "Asr", time: "15:45", icon: <Sun className="w-4 h-4" />, passed: false },
          { name: "Maghrib", time: "17:20", icon: <Sunset className="w-4 h-4" />, passed: false },
          { name: "Isha", time: "19:00", icon: <Moon className="w-4 h-4" />, passed: false }
        ];

        // Check which prayers have passed
        const currentTimeString = currentTime.toTimeString().slice(0, 5);
        const updatedTimes = times.map(prayer => ({
          ...prayer,
          passed: currentTimeString > prayer.time
        }));

        setPrayerTimes(updatedTimes);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();
  }, [currentTime]);

  const getNextPrayer = () => {
    const nextPrayer = prayerTimes.find(prayer => !prayer.passed);
    return nextPrayer || prayerTimes[0]; // If all passed, next is Fajr tomorrow
  };

  const nextPrayer = getNextPrayer();

  return (
    <GlassCard className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Prayer Times</h3>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
        </div>

        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              {nextPrayer.icon}
              <span className="text-sm font-medium text-primary">Next: {nextPrayer.name}</span>
            </div>
            <div className="text-lg font-bold text-foreground">{nextPrayer.time}</div>
          </div>
        )}

        {/* All Prayer Times */}
        <div className="grid grid-cols-5 gap-2">
          {prayerTimes.map((prayer, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded-lg transition-all duration-200 ${
                prayer.passed 
                  ? 'bg-muted/30 text-muted-foreground' 
                  : prayer === nextPrayer
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-accent/10 text-foreground hover:bg-accent/20'
              }`}
            >
              <div className="flex justify-center mb-1">
                {prayer.icon}
              </div>
              <div className="text-xs font-medium mb-1">{prayer.name}</div>
              <div className="text-xs font-mono">{prayer.time}</div>
            </div>
          ))}
        </div>

        {/* Current Time */}
        <div className="text-center pt-2 border-t border-accent/10">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{currentTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};