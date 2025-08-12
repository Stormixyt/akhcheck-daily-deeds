import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Users, Plus, Hash, MessageCircle, Flame } from "lucide-react";

interface Group {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at: string;
  member_count: number;
  current_streak: number;
}

export const Groups = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth-choice");
      return;
    }

    if (!profileLoading && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
      return;
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  const fetchUserGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(user_id),
          group_streaks(current_streak)
        `)
        .eq('group_members.user_id', user?.id);

      if (error) throw error;

      const groupsWithStats = await Promise.all(
        data.map(async (group) => {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

          return {
            ...group,
            member_count: count || 0,
            current_streak: group.group_streaks?.[0]?.current_streak || 0
          };
        })
      );

      setGroups(groupsWithStats);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: t('failed_to_load_groups'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 10).toLowerCase();
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;

    console.log('Creating group with user:', user?.id);
    console.log('Group name:', groupName.trim());

    try {
      const groupCode = generateGroupCode();
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName.trim(),
          code: groupCode,
          created_by: user?.id
        })
        .select()
        .single();

      console.log('Group creation result:', { groupData, groupError });
      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user?.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      // Create initial streak record
      const { error: streakError } = await supabase
        .from('group_streaks')
        .insert({
          group_id: groupData.id,
          current_streak: 0
        });

      if (streakError) throw streakError;

      toast({
        title: t('success'),
        description: t('group_created_successfully'),
      });

      setShowCreateForm(false);
      setGroupName("");
      fetchUserGroups();
    } catch (error: any) {
      console.error('Group creation error:', error);
      toast({
        title: t('error'),
        description: error.message || t('failed_to_create_group'),
        variant: "destructive",
      });
    }
  };

  const joinGroup = async () => {
    if (!groupCode.trim()) return;

    try {
      // Find group by code
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('code', groupCode.trim())
        .single();

      if (groupError) throw groupError;
      if (!groupData) {
        throw new Error(t('group_not_found'));
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupData.id)
        .eq('user_id', user?.id)
        .single();

      if (existingMember) {
        throw new Error(t('already_member_of_group'));
      }

      // Add as member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user?.id,
          role: 'member'
        });

      if (memberError) throw memberError;

      toast({
        title: t('success'),
        description: t('joined_group_successfully').replace('{groupName}', groupData.name),
      });

      setShowJoinForm(false);
      setGroupCode("");
      fetchUserGroups();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Header username={profile?.display_name || "Abdullah"} />
      
      <main className="max-w-sm mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('brotherhood_groups')}
          </h1>
          <p className="text-muted-foreground">{t('stay_disciplined_with_squad')}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="h-12 rounded-2xl glass-card border-primary/20 hover-lift"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('create_group')}
          </Button>
          <Button
            onClick={() => setShowJoinForm(true)}
            className="h-12 rounded-2xl glass-card border-accent/20 hover-lift"
            variant="outline"
          >
            <Hash className="w-4 h-4 mr-2" />
            {t('join_group')}
          </Button>
        </div>

        {/* How to Join Instructions */}
        <GlassCard className="p-4 bg-accent/5 border-accent/20">
          <h3 className="font-semibold text-foreground mb-2 flex items-center">
            <Hash className="w-4 h-4 mr-2 text-accent" />
            {t('how_to_join_group')}
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>🔹 {t('ask_friends_for_code')}</p>
            <p>🔹 {t('group_codes_work_anywhere')}</p>
            <p>🔹 {t('unique_8_character_code')}</p>
            <p>🔹 {t('group_codes_shown_below')}</p>
          </div>
        </GlassCard>

        {/* Create Group Form */}
        {showCreateForm && (
          <GlassCard className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">{t('create_new_group')}</h3>
            <div className="space-y-2">
              <Label htmlFor="groupName">{t('group_name')}</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={t('group_name_placeholder')}
                className="glass-card"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={createGroup} className="flex-1" disabled={!groupName.trim()}>
                {t('create')}
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="outline" className="flex-1">
                {t('cancel')}
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Join Group Form */}
        {showJoinForm && (
          <GlassCard className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">{t('join_group')}</h3>
            <div className="space-y-2">
              <Label htmlFor="groupCode">{t('group_code')}</Label>
              <Input
                id="groupCode"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toLowerCase())}
                placeholder={t('group_code_placeholder')}
                className="glass-card font-mono"
                maxLength={8}
              />
              <p className="text-xs text-muted-foreground">
                💡 {t('ask_friends_share_code')}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={joinGroup} className="flex-1" disabled={!groupCode.trim()}>
                {t('join_brotherhood')}
              </Button>
              <Button onClick={() => setShowJoinForm(false)} variant="outline" className="flex-1">
                {t('cancel')}
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Groups List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">{t('loading_groups')}</p>
            </div>
          ) : groups.length === 0 ? (
            <GlassCard className="p-6 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{t('no_groups_yet')}</h3>
              <p className="text-muted-foreground text-sm">{t('create_or_join_group')}</p>
            </GlassCard>
          ) : (
            groups.map((group) => (
              <GlassCard 
                key={group.id} 
                className="p-4 hover-lift cursor-pointer"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{group.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{group.member_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4" />
                        <span>{group.current_streak} {t('days')}</span>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Hash className="w-3 h-3 text-accent" />
                          <span className="text-xs text-muted-foreground">{t('share_this_code')}</span>
                        </div>
                        <span className="font-mono text-sm font-semibold text-accent">{group.code}</span>
                      </div>
                    </div>
                  </div>
                  <MessageCircle className="w-5 h-5 text-accent" />
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </main>
    </div>
  );
};