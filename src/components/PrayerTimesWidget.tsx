
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";
import { usePrayerTracker } from "@/hooks/usePrayerTracker";
import { useTranslation } from "@/hooks/useTranslation";

export const PrayerTimesWidget = () => {
  const { t } = useTranslation();
  const { todaysPrayers, prayerTimes, completedPrayers, updatePrayer, loading } = usePrayerTracker();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const prayers = [
    { key: 'fajr' as const, name: 'Fajr', time: prayerTimes?.fajr },
    { key: 'dhuhr' as const, name: 'Dhuhr', time: prayerTimes?.dhuhr },
    { key: 'asr' as const, name: 'Asr', time: prayerTimes?.asr },
    { key: 'maghrib' as const, name: 'Maghrib', time: prayerTimes?.maghrib },
    { key: 'isha' as const, name: 'Isha', time: prayerTimes?.isha },
  ];

  const getNextPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = currentTime.getTime();
    const today = currentTime.toDateString();
    
    for (const prayer of prayers) {
      if (!prayer.time) continue;
      
      const prayerTime = new Date(`${today} ${prayer.time}`).getTime();
      if (prayerTime > now) {
        return { ...prayer, timeUntil: prayerTime - now };
      }
    }
    
    // If no prayer today, next is Fajr tomorrow
    const tomorrowFajr = new Date(`${new Date(now + 86400000).toDateString()} ${prayers[0].time}`).getTime();
    return { ...prayers[0], timeUntil: tomorrowFajr - now };
  };

  const nextPrayer = getNextPrayer();
  
  const formatTimeUntil = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{t('prayer_times')}</h3>
        </div>
        <div className="text-center text-muted-foreground">{t('loading')}</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{t('prayer_times')}</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {completedPrayers}/5 {t('completed')}
        </div>
      </div>

      {nextPrayer && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg text-center">
          <div className="text-sm text-muted-foreground">{t('next_prayer')}</div>
          <div className="font-semibold text-foreground">{nextPrayer.name}</div>
          <div className="text-sm text-primary">
            {nextPrayer.time} ({formatTimeUntil(nextPrayer.timeUntil)})
          </div>
        </div>
      )}

      <div className="space-y-2">
        {prayers.map((prayer) => {
          const isCompleted = todaysPrayers?.[prayer.key] || false;
          
          return (
            <div key={prayer.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/20 transition-colors">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updatePrayer(prayer.key, !isCompleted)}
                  className={`w-6 h-6 ${isCompleted ? 'text-success' : 'text-muted-foreground'}`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-current' : ''}`} />
                </Button>
                <span className={`font-medium ${isCompleted ? 'text-success' : 'text-foreground'}`}>
                  {prayer.name}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {prayer.time || '--:--'}
              </span>
            </div>
          );
        })}
      </div>

      {completedPrayers === 5 && (
        <div className="mt-3 p-2 bg-success/10 rounded-lg text-center">
          <span className="text-success font-medium">Alhamdulillah! All prayers completed 🤲</span>
        </div>
      )}
    </GlassCard>
  );
};
