
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface FastingEntry {
  id: string;
  user_id: string;
  fast_date: string;
  fast_type: 'ramadan' | 'voluntary' | 'makeup' | 'sunnah';
  completed: boolean;
  broken_reason?: string | null;
}

export const useFastingTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todaysFast, setTodaysFast] = useState<FastingEntry | null>(null);
  const [weeklyFasts, setWeeklyFasts] = useState<FastingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchFastingData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get today's fast
      const { data: todayData, error: todayError } = await supabase
        .from('fasting_tracker')
        .select('*')
        .eq('user_id', user.id)
        .eq('fast_date', today)
        .single();

      if (todayError && todayError.code !== 'PGRST116') {
        throw todayError;
      }

      // Get this week's fasts
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const { data: weekData, error: weekError } = await supabase
        .from('fasting_tracker')
        .select('*')
        .eq('user_id', user.id)
        .gte('fast_date', weekStart.toISOString().split('T')[0])
        .lte('fast_date', weekEnd.toISOString().split('T')[0])
        .order('fast_date', { ascending: false });

      if (weekError) {
        throw weekError;
      }

      setTodaysFast(todayData);
      setWeeklyFasts(weekData || []);
    } catch (error: any) {
      console.error('Error fetching fasting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startFast = async (fastType: FastingEntry['fast_type']) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fasting_tracker')
        .insert({
          user_id: user.id,
          fast_date: today,
          fast_type: fastType,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      setTodaysFast(data);
      toast({
        title: "Fast Started 🌙",
        description: `May Allah make it easy for you. ${fastType} fast has begun.`,
      });
    } catch (error: any) {
      console.error('Error starting fast:', error);
      toast({
        title: "Error",
        description: "Failed to start fast",
        variant: "destructive",
      });
    }
  };

  const completeFast = async () => {
    if (!todaysFast) return;

    try {
      const { error } = await supabase
        .from('fasting_tracker')
        .update({ completed: true })
        .eq('id', todaysFast.id);

      if (error) throw error;

      setTodaysFast(prev => prev ? { ...prev, completed: true } : null);
      toast({
        title: "Alhamdulillah! 🎉",
        description: "Fast completed successfully. May Allah accept it from you.",
      });
    } catch (error: any) {
      console.error('Error completing fast:', error);
      toast({
        title: "Error",
        description: "Failed to complete fast",
        variant: "destructive",
      });
    }
  };

  const breakFast = async (reason: string) => {
    if (!todaysFast) return;

    try {
      const { error } = await supabase
        .from('fasting_tracker')
        .update({ 
          completed: false,
          broken_reason: reason 
        })
        .eq('id', todaysFast.id);

      if (error) throw error;

      setTodaysFast(prev => prev ? { 
        ...prev, 
        completed: false, 
        broken_reason: reason 
      } : null);

      toast({
        title: "Fast Status Updated",
        description: "May Allah make the next one easier for you.",
      });
    } catch (error: any) {
      console.error('Error updating fast:', error);
      toast({
        title: "Error",
        description: "Failed to update fast status",
        variant: "destructive",
      });
    }
  };

  const isRamadan = () => {
    // Simple Ramadan detection - in production, use proper Islamic calendar
    const now = new Date();
    const ramadanStart = new Date(now.getFullYear(), 2, 10); // Approximate
    const ramadanEnd = new Date(now.getFullYear(), 3, 10);   // Approximate
    return now >= ramadanStart && now <= ramadanEnd;
  };

  useEffect(() => {
    fetchFastingData();
  }, [user]);

  return {
    todaysFast,
    weeklyFasts,
    loading,
    startFast,
    completeFast,
    breakFast,
    isRamadan: isRamadan(),
    refetch: fetchFastingData,
  };
};
