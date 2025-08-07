import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface GroupGoal {
  id: string;
  group_id: string;
  title: string;
  description: string;
  target_count: number;
  current_count: number;
  created_by: string;
  created_at: string;
  completed: boolean;
}

export const useGroupGoals = (groupId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<GroupGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    if (!groupId) return;

    try {
      const { data, error } = await supabase
        .from('group_goals')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching group goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (title: string, description: string, targetCount: number) => {
    if (!user || !groupId) return;

    try {
      const { data, error } = await supabase
        .from('group_goals')
        .insert({
          group_id: groupId,
          title,
          description,
          target_count: targetCount,
          current_count: 0,
          created_by: user.id,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      toast({
        title: "Goal Created!",
        description: "New group goal has been added.",
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    }
  };

  const updateGoalProgress = async (goalId: string, increment: number = 1) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newCount = Math.max(0, goal.current_count + increment);
      const isCompleted = newCount >= goal.target_count;

      const { error } = await supabase
        .from('group_goals')
        .update({
          current_count: newCount,
          completed: isCompleted,
        })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev =>
        prev.map(g =>
          g.id === goalId
            ? { ...g, current_count: newCount, completed: isCompleted }
            : g
        )
      );

      if (isCompleted && !goal.completed) {
        toast({
          title: "Goal Completed! 🎉",
          description: `"${goal.title}" has been achieved!`,
        });
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [groupId]);

  return {
    goals,
    loading,
    createGoal,
    updateGoalProgress,
    refetch: fetchGoals,
  };
};