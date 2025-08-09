-- AkhCheck v2.2 Database Schema Upgrades (Fixed)

-- 1. Enhanced Groups with Sub-groups and Events
CREATE TABLE group_sub_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE group_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'challenge', -- challenge, ramadan, quran_completion, fasting
  start_date DATE NOT NULL,
  end_date DATE,
  rules JSONB DEFAULT '{}',
  leaderboard_data JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enhanced User Profiles with Islamic Features (Fixed timezone column name)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  masjid_name TEXT,
  user_timezone TEXT DEFAULT 'UTC',
  prayer_notification_settings JSONB DEFAULT '{"fajr": true, "dhuhr": true, "asr": true, "maghrib": true, "isha": true}',
  fasting_preferences JSONB DEFAULT '{"auto_ramadan": true, "voluntary_fasting": false}',
  privacy_settings JSONB DEFAULT '{"public_stats": false, "hide_online_status": false, "private_goals": false}',
  streak_revival_tokens INTEGER DEFAULT 0,
  total_discipline_score INTEGER DEFAULT 0,
  current_month_score INTEGER DEFAULT 0;

-- 3. Fasting Tracker
CREATE TABLE fasting_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  fast_date DATE NOT NULL,
  fast_type TEXT NOT NULL DEFAULT 'obligatory', -- obligatory, voluntary, makeup
  status TEXT NOT NULL DEFAULT 'planned', -- planned, completed, broken, missed
  break_time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, fast_date)
);

-- 4. Custom Challenges System
CREATE TABLE custom_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rules JSONB NOT NULL DEFAULT '{}',
  duration_days INTEGER NOT NULL DEFAULT 7,
  is_public BOOLEAN DEFAULT false,
  max_participants INTEGER DEFAULT 50,
  start_date DATE,
  end_date DATE,
  challenge_type TEXT DEFAULT 'personal', -- personal, group, masjid, public
  difficulty_level TEXT DEFAULT 'medium', -- easy, medium, hard, extreme
  reward_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES custom_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, completed, dropped_out
  final_score INTEGER DEFAULT 0,
  UNIQUE(challenge_id, user_id)
);

-- 5. AI Discipline Coach Data
CREATE TABLE ai_coach_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT DEFAULT 'advice', -- advice, analysis, motivation, planning
  conversation_data JSONB NOT NULL DEFAULT '[]',
  advice_given TEXT,
  user_feedback TEXT,
  effectiveness_rating INTEGER, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Enhanced Group Features
ALTER TABLE groups ADD COLUMN IF NOT EXISTS
  group_type TEXT DEFAULT 'standard', -- standard, family, masjid, study_circle
  is_private BOOLEAN DEFAULT false,
  max_members INTEGER DEFAULT 50,
  group_settings JSONB DEFAULT '{"voice_checkins": false, "lock_mode": false, "public_leaderboard": true}',
  weekly_theme TEXT,
  group_avatar_url TEXT;

-- 7. Group Leaderboards
CREATE TABLE group_leaderboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  period_type TEXT NOT NULL, -- daily, weekly, monthly
  period_date DATE NOT NULL,
  discipline_score INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  goals_completed INTEGER DEFAULT 0,
  rank_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id, period_type, period_date)
);

-- 8. Voice Check-ins
CREATE TABLE voice_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  transcription TEXT,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Daily Islamic Content
CREATE TABLE daily_islamic_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- ayah, hadith, dhikr, dua
  arabic_text TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  reference TEXT NOT NULL,
  tafseer_link TEXT,
  theme_tags TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'medium',
  content_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_type, content_date)
);

-- 10. Enhanced Messaging System
ALTER TABLE group_messages ADD COLUMN IF NOT EXISTS
  is_pinned BOOLEAN DEFAULT false,
  pinned_by UUID,
  pinned_at TIMESTAMP WITH TIME ZONE,
  reactions JSONB DEFAULT '{}',
  reply_to_message_id UUID REFERENCES group_messages(id),
  is_voice_message BOOLEAN DEFAULT false,
  voice_duration_seconds INTEGER,
  read_by JSONB DEFAULT '{}';

-- 11. User Themes and Customization
CREATE TABLE user_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  theme_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  theme_data JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, theme_name)
);

-- 12. Prayer Times Cache
CREATE TABLE prayer_times_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  city TEXT,
  country TEXT,
  date DATE NOT NULL,
  prayer_times JSONB NOT NULL,
  user_timezone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(latitude, longitude, date)
);

-- 13. Security & 2FA
CREATE TABLE user_security (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  backup_codes TEXT[],
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. Data Export Logs
CREATE TABLE data_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  export_type TEXT NOT NULL, -- csv, pdf, json
  export_data TEXT NOT NULL, -- S3 URL or data blob
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + INTERVAL '7 days'
);

-- Enable RLS on all new tables
ALTER TABLE group_sub_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_islamic_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;