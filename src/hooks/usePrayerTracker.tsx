
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface PrayerEntry {
  id: string;
  user_id: string;
  prayer_date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export const usePrayerTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todaysPrayers, setTodaysPrayers] = useState<PrayerEntry | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchTodaysPrayers = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('prayer_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('prayer_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setTodaysPrayers(data);
    } catch (error: any) {
      console.error('Error fetching prayers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrayer = async (prayer: keyof Omit<PrayerEntry, 'id' | 'user_id' | 'prayer_date'>, completed: boolean) => {
    if (!user) return;

    try {
      if (!todaysPrayers) {
        // Create new entry
        const newEntry = {
          user_id: user.id,
          prayer_date: today,
          fajr: prayer === 'fajr' ? completed : false,
          dhuhr: prayer === 'dhuhr' ? completed : false,
          asr: prayer === 'asr' ? completed : false,
          maghrib: prayer === 'maghrib' ? completed : false,
          isha: prayer === 'isha' ? completed : false,
        };

        const { data, error } = await supabase
          .from('prayer_tracking')
          .insert(newEntry)
          .select()
          .single();

        if (error) throw error;
        setTodaysPrayers(data);
      } else {
        // Update existing entry
        const { error } = await supabase
          .from('prayer_tracking')
          .update({ [prayer]: completed })
          .eq('id', todaysPrayers.id);

        if (error) throw error;
        
        setTodaysPrayers(prev => prev ? { ...prev, [prayer]: completed } : null);
      }

      if (completed) {
        toast({
          title: "Alhamdulillah! 🤲",
          description: `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} prayer marked as completed`,
        });
      }
    } catch (error: any) {
      console.error('Error updating prayer:', error);
      toast({
        title: "Error",
        description: "Failed to update prayer status",
        variant: "destructive",
      });
    }
  };

  const fetchPrayerTimes = async () => {
    try {
      // Get user's location (simplified - in production, use proper geolocation)
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2');
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes({
          fajr: data.data.timings.Fajr,
          dhuhr: data.data.timings.Dhuhr,
          asr: data.data.timings.Asr,
          maghrib: data.data.timings.Maghrib,
          isha: data.data.timings.Isha,
        });
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  useEffect(() => {
    fetchTodaysPrayers();
    fetchPrayerTimes();
  }, [user]);

  const completedPrayers = todaysPrayers ? 
    Object.values(todaysPrayers).filter((value, index) => 
      index > 2 && typeof value === 'boolean' && value
    ).length : 0;

  return {
    todaysPrayers,
    prayerTimes,
    completedPrayers,
    loading,
    updatePrayer,
    refetch: fetchTodaysPrayers,
  };
};
