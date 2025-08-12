
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  email: string | null;
  avatar_url?: string | null;
  onboarding_completed?: boolean;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  anonymous_mode: boolean;
  repeat_warnings: boolean;
  daily_reminder: boolean;
  reminder_time: string;
  theme: 'green' | 'blue' | 'purple';
  dark_mode?: boolean;
  has_seen_v11_update: boolean;
  has_seen_v12_update: boolean;
  // v2.2 new fields
  premium: boolean;
  quiet_mode: boolean;
  private_mode: boolean;
  public_accountability: boolean;
  auto_logout_minutes: number;
  blur_intensity: number;
  font_choice: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  name: string;
  completed: boolean;
  is_default: boolean;
  completed_at: string | null;
  // v2.2 lock-in mode
  locked_until: string | null;
  lock_reason: string | null;
}

export interface StreakRevivalTokens {
  id: string;
  user_id: string;
  tokens_available: number;
  tokens_used: number;
  last_earned_at: string | null;
}

export interface FastingEntry {
  id: string;
  user_id: string;
  fast_date: string;
  fast_type: 'ramadan' | 'voluntary' | 'makeup' | 'sunnah';
  completed: boolean;
  broken_reason?: string | null;
}

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

export const useUserData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [revivalTokens, setRevivalTokens] = useState<StreakRevivalTokens | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        throw preferencesError;
      }

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (goalsError) {
        throw goalsError;
      }

      // Fetch revival tokens
      const { data: tokensData, error: tokensError } = await supabase
        .from('streak_revival_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (tokensError && tokensError.code !== 'PGRST116') {
        console.log('No revival tokens found, will be created on first use');
      }

      setProfile(profileData);
      setPreferences(preferencesData as UserPreferences);
      setGoals(goalsData || []);
      setRevivalTokens(tokensData);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          ...updates,
        });

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, ...updates } : null);
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    }
  };

  const addGoal = async (name: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          name,
          completed: false,
          is_default: false,
        })
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Goal added successfully",
      });
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      });
    }
  };

  const toggleGoal = async (goalId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev =>
        prev.map(goal =>
          goal.id === goalId
            ? { ...goal, completed, completed_at: completed ? new Date().toISOString() : null }
            : goal
        )
      );
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    }
  };

  const lockGoal = async (goalId: string, lockDays: number, reason: string) => {
    if (!user) return;

    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + lockDays);

    try {
      const { error } = await supabase
        .from('user_goals')
        .update({
          locked_until: lockUntil.toISOString().split('T')[0],
          lock_reason: reason,
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals(prev =>
        prev.map(goal =>
          goal.id === goalId
            ? { 
                ...goal, 
                locked_until: lockUntil.toISOString().split('T')[0],
                lock_reason: reason 
              }
            : goal
        )
      );

      toast({
        title: "Goal Locked",
        description: `Goal locked for ${lockDays} days. Stay strong!`,
      });
    } catch (error: any) {
      console.error('Error locking goal:', error);
      toast({
        title: "Error",
        description: "Failed to lock goal",
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  const useRevivalToken = async () => {
    if (!user || !revivalTokens || revivalTokens.tokens_available <= 0) return false;

    try {
      const { error } = await supabase
        .from('streak_revival_tokens')
        .update({
          tokens_available: revivalTokens.tokens_available - 1,
          tokens_used: revivalTokens.tokens_used + 1,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setRevivalTokens(prev => prev ? {
        ...prev,
        tokens_available: prev.tokens_available - 1,
        tokens_used: prev.tokens_used + 1,
      } : null);

      toast({
        title: "Streak Revived! ❤️‍🔥",
        description: "Your streak has been restored. Use this chance wisely!",
      });

      return true;
    } catch (error: any) {
      console.error('Error using revival token:', error);
      toast({
        title: "Error",
        description: "Failed to use revival token",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return {
    profile,
    preferences,
    goals,
    revivalTokens,
    loading,
    updateProfile,
    updatePreferences,
    addGoal,
    toggleGoal,
    lockGoal,
    deleteGoal,
    useRevivalToken,
    refetch: fetchUserData,
  };
};
