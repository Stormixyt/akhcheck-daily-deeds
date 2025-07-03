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
    fetchPrayerTimes();
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      // Get user's location first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await loadPrayerTimesForLocation(position.coords.latitude, position.coords.longitude);
          },
          async () => {
            // Fallback to Amsterdam, Netherlands if location access denied
            await loadPrayerTimesForCity('Amsterdam', 'Netherlands');
          }
        );
      } else {
        // Fallback to Amsterdam, Netherlands if geolocation not supported
        await loadPrayerTimesForCity('Amsterdam', 'Netherlands');
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      // Use fallback static times if API fails
      setFallbackTimes();
    }
  };

  const loadPrayerTimesForLocation = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3&school=1`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimesFromAPI(data.data);
        setLocation(`${data.data.meta.city || 'Your location'}`);
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error loading prayer times for location:', error);
      // Fallback to Amsterdam
      await loadPrayerTimesForCity('Amsterdam', 'Netherlands');
    }
  };

  const loadPrayerTimesForCity = async (city: string, country: string) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=3&school=1`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimesFromAPI(data.data);
        setLocation(`${city}, ${country}`);
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error loading prayer times for city:', error);
      setFallbackTimes();
    }
  };

  const setPrayerTimesFromAPI = (data: any) => {
    const timings = data.timings;
    const currentTimeString = currentTime.toTimeString().slice(0, 5);
    
    const times = [
      { 
        name: "Fajr", 
        time: formatTime(timings.Fajr), 
        icon: <Sunrise className="w-4 h-4" />, 
        passed: currentTimeString > formatTime(timings.Fajr)
      },
      { 
        name: "Dhuhr", 
        time: formatTime(timings.Dhuhr), 
        icon: <Sun className="w-4 h-4" />, 
        passed: currentTimeString > formatTime(timings.Dhuhr)
      },
      { 
        name: "Asr", 
        time: formatTime(timings.Asr), 
        icon: <Sun className="w-4 h-4" />, 
        passed: currentTimeString > formatTime(timings.Asr)
      },
      { 
        name: "Maghrib", 
        time: formatTime(timings.Maghrib), 
        icon: <Sunset className="w-4 h-4" />, 
        passed: currentTimeString > formatTime(timings.Maghrib)
      },
      { 
        name: "Isha", 
        time: formatTime(timings.Isha), 
        icon: <Moon className="w-4 h-4" />, 
        passed: currentTimeString > formatTime(timings.Isha)
      }
    ];

    setPrayerTimes(times);
  };

  const formatTime = (timeString: string) => {
    // Remove timezone info and seconds, return HH:MM format
    return timeString.split(' ')[0].slice(0, 5);
  };

  const setFallbackTimes = () => {
    const currentTimeString = currentTime.toTimeString().slice(0, 5);
    const times = [
      { name: "Fajr", time: "06:00", icon: <Sunrise className="w-4 h-4" />, passed: currentTimeString > "06:00" },
      { name: "Dhuhr", time: "12:30", icon: <Sun className="w-4 h-4" />, passed: currentTimeString > "12:30" },
      { name: "Asr", time: "15:00", icon: <Sun className="w-4 h-4" />, passed: currentTimeString > "15:00" },
      { name: "Maghrib", time: "17:30", icon: <Sunset className="w-4 h-4" />, passed: currentTimeString > "17:30" },
      { name: "Isha", time: "19:00", icon: <Moon className="w-4 h-4" />, passed: currentTimeString > "19:00" }
    ];
    setPrayerTimes(times);
    setLocation("Netherlands (Approximate)");
  };

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