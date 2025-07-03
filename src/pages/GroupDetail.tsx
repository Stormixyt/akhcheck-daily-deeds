import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Users, Flame, BookOpen, Plus, Image, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GroupNotifications } from "@/components/GroupNotifications";

interface Group {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at: string;
  current_streak: number;
  member_count: number;
}

interface Message {
  id: string;
  group_id: string;
  user_id: string;
  message: string | null;
  type: string;
  metadata: any;
  image_url: string | null;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    display_name: string;
  };
}

const quranVerses = [
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    translation: "En wie Allah vreest, Hij zal voor hem een uitweg maken.",
    reference: "At-Talaq 65:2"
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Voorwaar, met moeite komt gemak.",
    reference: "Ash-Sharh 94:6"
  },
  {
    arabic: "وَاللَّهُ مَعَ الصَّابِرِينَ",
    translation: "En Allah is met de geduldigen.",
    reference: "Al-Baqarah 2:153"
  }
];

export const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserData();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !groupId) return;
    
    fetchGroupData();
    fetchMessages();
    fetchMembers();
    checkTodayStatus();
    
    // Set up realtime subscription for messages
    const channel = supabase
      .channel(`group_${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`
        },
        async (payload) => {
          // Get profile data for the new message
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', payload.new.user_id)
            .single();
          
          // Add message instantly to UI
          const newMessage: Message = {
            id: payload.new.id,
            group_id: payload.new.group_id,
            user_id: payload.new.user_id,
            message: payload.new.message,
            type: payload.new.type,
            metadata: payload.new.metadata,
            image_url: payload.new.image_url,
            created_at: payload.new.created_at,
            profiles: profileData || { display_name: 'Unknown' }
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchGroupData = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_streaks(current_streak)
        `)
        .eq('id', groupId)
        .single();

      if (error) throw error;

      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

      setGroup({
        ...data,
        current_streak: data.group_streaks?.[0]?.current_streak || 0,
        member_count: count || 0
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load group data",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select(`
          id,
          group_id,
          user_id,
          message,
          type,
          metadata,
          image_url,
          created_at
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch profiles separately
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', message.user_id)
            .single();
          
          return {
            ...message,
            profiles: profileData || { display_name: 'Unknown' }
          };
        })
      );
      
      setMessages(messagesWithProfiles);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          role,
          group_id,
          joined_at
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      
      // Fetch profiles separately
      const membersWithProfiles = await Promise.all(
        (data || []).map(async (member) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', member.user_id)
            .single();
          
          return {
            ...member,
            profiles: profileData || { display_name: 'Unknown' }
          };
        })
      );
      
      setMembers(membersWithProfiles);
    } catch (error: any) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', user?.id)
        .eq('group_id', groupId)
        .eq('check_date', today)
        .single();

      if (data) {
        setHasCheckedToday(true);
      }
    } catch (error) {
      // No check-in found, which is fine
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !groupId) return;

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          user_id: user?.id,
          message: newMessage.trim(),
          type: 'text'
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const dropQuranVerse = async () => {
    const randomVerse = quranVerses[Math.floor(Math.random() * quranVerses.length)];
    
    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          user_id: user?.id,
          type: 'verse',
          metadata: randomVerse
        });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to drop verse",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file || !groupId || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${groupId}/${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      // Send image message
      await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          type: 'image',
          image_url: publicUrl
        });

      toast({
        title: "Image sent!",
        description: "Your image has been shared with the group.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDailyCheckIn = async (status: 'disciplined' | 'gooned') => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Record check-in
      const { error: checkInError } = await supabase
        .from('daily_check_ins')
        .insert({
          user_id: user?.id,
          group_id: groupId,
          status,
          check_date: today
        });

      if (checkInError) throw checkInError;

      // Send system message
      const systemMessage = status === 'disciplined' 
        ? `${profile?.display_name} stayed disciplined today 💪`
        : `${profile?.display_name} gooned today 💀`;

      await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          user_id: user?.id,
          message: systemMessage,
          type: 'system'
        });

      setHasCheckedToday(true);
      
      // Update group streak logic
      await updateGroupStreak(status);
      
      toast({
        title: status === 'disciplined' ? "Alhamdulillah! 🤲" : "Don't give up 💚",
        description: status === 'disciplined' 
          ? "Your discipline has been recorded!" 
          : "Tomorrow is a new chance. Make tawbah and restart.",
        className: status === 'disciplined' 
          ? "bg-success text-success-foreground border-success"
          : "bg-destructive text-destructive-foreground border-destructive",
      });
    } catch (error: any) {
      console.error('Check-in error:', error);
      toast({
        title: "Error",
        description: "Failed to record check-in",
        variant: "destructive",
      });
    }
  };

  const updateGroupStreak = async (status: 'disciplined' | 'gooned') => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all members' check-ins for today
      const { data: todayCheckIns } = await supabase
        .from('daily_check_ins')
        .select('status')
        .eq('group_id', groupId)
        .eq('check_date', today);

      // Check if everyone checked in and maintained discipline
      const totalMembers = group?.member_count || 0;
      const checkedInCount = todayCheckIns?.length || 0;
      const disciplinedCount = todayCheckIns?.filter(ci => ci.status === 'disciplined').length || 0;

      if (checkedInCount === totalMembers) {
        // Everyone checked in, update streak
        const newStreak = disciplinedCount === totalMembers ? (group?.current_streak || 0) + 1 : 0;
        
        await supabase
          .from('group_streaks')
          .upsert({
            group_id: groupId,
            current_streak: newStreak,
            last_check_date: today
          });

        // Refresh group data
        fetchGroupData();
      }
    } catch (error) {
      console.error('Error updating group streak:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Group not found</h2>
          <Button onClick={() => navigate("/groups")} className="mt-4">
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Group Notifications */}
      <GroupNotifications groupId={groupId || ""} userId={user?.id || ""} />
      
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/groups")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">{group.name}</h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{group.member_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4" />
                <span>{group.current_streak} days</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="text-lg">🏠</span>
          </Button>
        </div>
      </header>

      {/* Daily Check-in */}
      {!hasCheckedToday && (
        <div className="p-4 max-w-md mx-auto w-full">
          <GlassCard className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Daily Check-in</h3>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleDailyCheckIn('disciplined')}
                className="flex-1 bg-success hover:bg-success/80 text-success-foreground"
              >
                ✅ I stayed disciplined
              </Button>
              <Button
                onClick={() => handleDailyCheckIn('gooned')}
                className="flex-1 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20"
                variant="outline"
              >
                💀 I gooned
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.type === 'verse' ? (
              <GlassCard className="p-4 border-accent/20">
                <div className="text-center space-y-2">
                  <BookOpen className="w-6 h-6 text-accent mx-auto" />
                  <div className="text-lg font-arabic text-foreground" dir="rtl">
                    {message.metadata.arabic}
                  </div>
                  <div className="text-sm text-muted-foreground italic">
                    "{message.metadata.translation}"
                  </div>
                  <div className="text-xs text-accent font-semibold">
                    — {message.metadata.reference}
                  </div>
                </div>
              </GlassCard>
            ) : message.type === 'image' ? (
              <div className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-2xl ${
                  message.user_id === user?.id 
                    ? 'bg-primary text-primary-foreground ml-4' 
                    : 'bg-card text-card-foreground mr-4'
                }`}>
                  {message.user_id !== user?.id && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {message.profiles?.display_name}
                    </div>
                  )}
                  {message.image_url && (
                    <img
                      src={message.image_url}
                      alt="Shared image"
                      className="max-w-full h-auto rounded-lg cursor-pointer"
                      onClick={() => window.open(message.image_url!, '_blank')}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.user_id === user?.id 
                    ? 'bg-primary text-primary-foreground ml-4' 
                    : 'bg-card text-card-foreground mr-4'
                }`}>
                  {message.user_id !== user?.id && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {message.profiles?.display_name}
                    </div>
                  )}
                  <div className={`text-sm ${message.type === 'system' ? 'italic' : ''}`}>
                    {message.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-card/50 backdrop-blur-md border-t border-border max-w-md mx-auto w-full">
        {/* Quick Action Buttons - Only show if not checked in today */}
        {!hasCheckedToday && (
          <div className="flex space-x-2 mb-3">
            <Button
              onClick={() => handleDailyCheckIn('disciplined')}
              className="flex-1 bg-success hover:bg-success/80 text-success-foreground text-xs py-2"
              size="sm"
            >
              ✅ I Succeeded
            </Button>
            <Button
              onClick={() => handleDailyCheckIn('gooned')}
              className="flex-1 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 text-xs py-2"
              variant="outline"
              size="sm"
            >
              💀 I gooned
            </Button>
          </div>
        )}

        <div className="flex space-x-2 mb-2">
          <Button
            onClick={dropQuranVerse}
            variant="outline"
            size="sm"
            className="glass-card border-accent/20"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Drop Verse
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="glass-card border-accent/20"
            disabled={uploading}
          >
            <Image className="w-4 h-4 mr-1" />
            {uploading ? 'Uploading...' : 'Image'}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="glass-card"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file);
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};