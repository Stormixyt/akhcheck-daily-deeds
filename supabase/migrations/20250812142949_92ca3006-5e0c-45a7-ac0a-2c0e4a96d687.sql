
-- Add premium flag to user preferences
ALTER TABLE user_preferences ADD COLUMN premium BOOLEAN NOT NULL DEFAULT false;

-- Add privacy settings
ALTER TABLE user_preferences ADD COLUMN quiet_mode BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE user_preferences ADD COLUMN private_mode BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE user_preferences ADD COLUMN public_accountability BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE user_preferences ADD COLUMN auto_logout_minutes INTEGER DEFAULT 60;

-- Add theme customization
ALTER TABLE user_preferences ADD COLUMN blur_intensity INTEGER DEFAULT 50;
ALTER TABLE user_preferences ADD COLUMN font_choice TEXT DEFAULT 'default';

-- Create sub-groups table
CREATE TABLE public.sub_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general', -- 'family', 'friends', 'masjid', 'general'
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for sub_groups
ALTER TABLE public.sub_groups ENABLE ROW LEVEL SECURITY;

-- RLS policies for sub_groups
CREATE POLICY "Users can view sub-groups of their groups" 
  ON public.sub_groups 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = sub_groups.parent_group_id 
    AND group_members.user_id = auth.uid()
  ));

CREATE POLICY "Group members can create sub-groups" 
  ON public.sub_groups 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by AND EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = sub_groups.parent_group_id 
    AND group_members.user_id = auth.uid()
  ));

-- Create group events table
CREATE TABLE public.group_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'challenge', -- 'challenge', 'ramadan', 'quran', 'fasting'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_value INTEGER DEFAULT 1,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for group_events
ALTER TABLE public.group_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for group_events
CREATE POLICY "Users can view events in their groups" 
  ON public.group_events 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = group_events.group_id 
    AND group_members.user_id = auth.uid()
  ));

CREATE POLICY "Group members can create events" 
  ON public.group_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by AND EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = group_events.group_id 
    AND group_members.user_id = auth.uid()
  ));

-- Create event participations table
CREATE TABLE public.event_participations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.group_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for event_participations
ALTER TABLE public.event_participations ENABLE ROW LEVEL SECURITY;

-- RLS policies for event_participations
CREATE POLICY "Users can view their own participations" 
  ON public.event_participations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join events" 
  ON public.event_participations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participations" 
  ON public.event_participations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create fasting tracker table
CREATE TABLE public.fasting_tracker (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  fast_date DATE NOT NULL,
  fast_type TEXT NOT NULL DEFAULT 'voluntary', -- 'ramadan', 'voluntary', 'makeup', 'sunnah'
  completed BOOLEAN DEFAULT false,
  broken_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, fast_date)
);

-- Enable RLS for fasting_tracker
ALTER TABLE public.fasting_tracker ENABLE ROW LEVEL SECURITY;

-- RLS policies for fasting_tracker
CREATE POLICY "Users can manage their own fasting data" 
  ON public.fasting_tracker 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create prayer tracking table
CREATE TABLE public.prayer_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prayer_date DATE NOT NULL,
  fajr BOOLEAN DEFAULT false,
  dhuhr BOOLEAN DEFAULT false,
  asr BOOLEAN DEFAULT false,
  maghrib BOOLEAN DEFAULT false,
  isha BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, prayer_date)
);

-- Enable RLS for prayer_tracking
ALTER TABLE public.prayer_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for prayer_tracking
CREATE POLICY "Users can manage their own prayer data" 
  ON public.prayer_tracking 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add message reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.group_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction TEXT NOT NULL, -- Limited to halal reactions: 'like', 'heart', 'dua', 'ameen', 'mashaallah'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS for message_reactions
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_reactions
CREATE POLICY "Users can view reactions in their groups" 
  ON public.message_reactions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM group_messages gm
    JOIN group_members gms ON gm.group_id = gms.group_id
    WHERE gm.id = message_reactions.message_id 
    AND gms.user_id = auth.uid()
  ));

CREATE POLICY "Users can add reactions" 
  ON public.message_reactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions" 
  ON public.message_reactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add read receipts to group_messages
ALTER TABLE group_messages ADD COLUMN read_by JSONB DEFAULT '[]'::jsonb;

-- Add pinned messages
ALTER TABLE group_messages ADD COLUMN pinned BOOLEAN DEFAULT false;
ALTER TABLE group_messages ADD COLUMN pinned_by UUID NULL;
ALTER TABLE group_messages ADD COLUMN pinned_at TIMESTAMP WITH TIME ZONE NULL;

-- Add lock-in mode to user_goals
ALTER TABLE user_goals ADD COLUMN locked_until DATE NULL;
ALTER TABLE user_goals ADD COLUMN lock_reason TEXT NULL;

-- Create streak revival tokens table
CREATE TABLE public.streak_revival_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tokens_available INTEGER DEFAULT 1,
  tokens_used INTEGER DEFAULT 0,
  last_earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for streak_revival_tokens
ALTER TABLE public.streak_revival_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for streak_revival_tokens
CREATE POLICY "Users can view their own tokens" 
  ON public.streak_revival_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" 
  ON public.streak_revival_tokens 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create AI coaching sessions table (premium feature)
CREATE TABLE public.ai_coaching_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'advice', -- 'advice', 'motivation', 'analysis'
  tone_preference TEXT NOT NULL DEFAULT 'soft', -- 'soft', 'tough'
  conversation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for ai_coaching_sessions
ALTER TABLE public.ai_coaching_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_coaching_sessions (premium only)
CREATE POLICY "Premium users can access AI coaching" 
  ON public.ai_coaching_sessions 
  FOR ALL 
  USING (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM user_preferences 
    WHERE user_id = auth.uid() AND premium = true
  ))
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM user_preferences 
    WHERE user_id = auth.uid() AND premium = true
  ));

-- Add realtime for new tables
ALTER TABLE public.sub_groups REPLICA IDENTITY FULL;
ALTER TABLE public.group_events REPLICA IDENTITY FULL;
ALTER TABLE public.event_participations REPLICA IDENTITY FULL;
ALTER TABLE public.fasting_tracker REPLICA IDENTITY FULL;
ALTER TABLE public.prayer_tracking REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.streak_revival_tokens REPLICA IDENTITY FULL;
ALTER TABLE public.ai_coaching_sessions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sub_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_participations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fasting_tracker;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayer_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.streak_revival_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_coaching_sessions;

-- Update the handle_new_user function to include new defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Abdullah'), NEW.email);
  
  -- Create default preferences with new fields
  INSERT INTO public.user_preferences (
    user_id, 
    premium, 
    quiet_mode, 
    private_mode, 
    public_accountability,
    auto_logout_minutes,
    blur_intensity,
    font_choice
  ) VALUES (
    NEW.id, 
    false, 
    false, 
    false, 
    false,
    60,
    50,
    'default'
  );
  
  -- Create default goals
  INSERT INTO public.user_goals (user_id, name, is_default) VALUES
    (NEW.id, '5x Daily Prayers', true),
    (NEW.id, '1 Hour Learning', true),
    (NEW.id, '20min Exercise', true);
  
  -- Create streak revival tokens
  INSERT INTO public.streak_revival_tokens (user_id, tokens_available, tokens_used)
  VALUES (NEW.id, 1, 0);
  
  RETURN NEW;
END;
$$;
