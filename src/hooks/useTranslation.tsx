import { useState, createContext, useContext, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

interface TranslationContextType {
  language: 'en' | 'nl';
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // General
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'close': 'Close',
    'settings': 'Settings',
    'notifications': 'Notifications',
    'profile': 'Profile',
    'stay_disciplined': 'Stay disciplined, stay sincere',
    'create_account': 'Create Account',
    'sign_in': 'Sign In',
    'sign_out': 'Sign Out',
    'honest_agreement': 'By continuing, you agree to be honest with yourself and Allah',
    'display_name': 'Display Name',
    'email': 'Email',
    'email_cannot_change': 'Email cannot be changed',
    'saving': 'Saving...',
    'password': 'Password',
    'welcome_back': 'Welcome Back',
    'welcome_back_akhi': 'Welcome back, akhi',
    'join_community': 'Join the AkhCheck community',
    'success': 'Success',
    'error': 'Error',
    'dont_have_account': "Don't have an account?",
    'already_have_account': 'Already have an account?',
    'sign_up': 'Sign up',
    'edit_profile': 'Edit Profile',
    'as_salamu_alaykum': 'As-salamu alaykum',
    'theme_settings': 'Theme Settings',
    'dark_mode': 'Dark Mode',
    'light': 'Light',
    'dark': 'Dark',
    'color_theme': 'Color Theme',
    'you': 'You',
    'quran_verse': '"And whoever fears Allah - He will make for him a way out."',
    'quran_reference': '— Quran 65:2',
    
    // Home page
    'daily_challenge': "Today's Challenge",
    'prayer_times': 'Prayer Times',
    'streak': 'day streak',
    'how_did_you_do': 'How did you do today?',
    'i_succeeded': 'I Succeeded',
    'i_gooned': 'I gooned',
    'status_updated': 'Status updated for today!',
    
    // Challenges
    'mark_complete': 'Mark as Complete',
    'completed': 'Completed! 🎉',
    'easy': 'Easy',
    'medium': 'Medium',
    'hard': 'Hard',
    
    // Groups
    'groups': 'Groups',
    'create_group': 'Create Group',
    'join_group': 'Join Group',
    'group_chat': 'Group Chat',
    'members': 'members',
    'days': 'days',
    'daily_checkin': 'Daily Check-in',
    'i_stayed_disciplined': 'I stayed disciplined',
    'all_checked_in': 'Everyone has checked in today!',
    'streak_maintained': 'All members maintained their streak',
    'brotherhood_groups': 'Brotherhood Groups',
    'stay_disciplined_with_squad': 'Stay disciplined with your squad',
    'how_to_join_group': 'How to Join a Group',
    'ask_friends_for_code': 'Ask your friends for their Group Code',
    'group_codes_work_anywhere': 'Group codes work anywhere - no same network needed!',
    'unique_8_character_code': 'Each group has a unique 8-character code',
    'group_codes_shown_below': 'Your group codes are shown below each group name',
    'create_new_group': 'Create New Group',
    'group_name': 'Group Name',
    'group_name_placeholder': 'Halal Squad',
    'create': 'Create',
    'group_code': 'Group Code',
    'group_code_placeholder': 'e.g. abc123de',
    'ask_friends_share_code': 'Ask your friends to share their group code with you',
    'join_brotherhood': 'Join Brotherhood',
    'loading_groups': 'Loading groups...',
    'no_groups_yet': 'No groups yet',
    'create_or_join_group': 'Create or join a group to get started',
    'share_this_code': 'Share this code:',
    'group_created_successfully': 'Group created successfully!',
    'failed_to_create_group': 'Failed to create group',
    'failed_to_load_groups': 'Failed to load groups',
    'group_not_found': 'Group not found',
    'already_member_of_group': 'You are already a member of this group',
    'joined_group_successfully': 'Joined {groupName} successfully!',
    
    // Notifications
    'total_notifications': 'Total notifications',
    'unread': 'Unread',
    'recent_activity': 'Recent Activity',
    'mark_all_read': 'Mark All as Read',
    'just_now': 'Just now',
    'hours_ago': 'hours ago',
    'days_ago': 'days ago',
    
    // Settings
    'anonymous_mode': 'Anonymous Mode',
    'hide_status_from_friends': 'Hide your status from friends',
    'repeat_warnings': 'Repeat Warnings',
    'show_sin_warning_every_time': 'Show sin warning every time',
    'daily_reminder': 'Daily Reminder',
    'get_reminded_to_check_in': 'Get reminded to check in',
    'reminder_time': 'Reminder Time',
    'daily_goals': 'Daily Goals',
    'add_custom_goal': 'Add custom goal...',
    
    // Motivational
    'alhamdulillah': 'Alhamdulillah! 🤲',
    'dont_give_up': "Don't give up 💚",
    'keep_going': 'Your discipline has been recorded!',
    'tomorrow_new_chance': 'Tomorrow is a new chance. Make tawbah and restart.',
    
    // Update modal
    'update_title': '🚀 AkhCheck v1.2 – Power Update',
    'update_subtitle': 'New level of discipline and connection, akhi.',
    'daily_notifications': '🔔 Daily notification system',
    'real_notifications': '📢 Real group notifications',
    'dark_theme': '🌙 Light & Dark theme toggle',
    'custom_goals': '🎯 Custom group goals',
    'more_challenges': '🚀 More daily challenges',
    'translate_button': '🌍 Translate button (EN/NL)',
    'sync_fixes': '🔧 Sync fixes & UI improvements',
    'lets_lock_in': "Let's Lock In 🔥",

    // Onboarding
    'welcome_to_akhcheck': 'Welcome to AkhCheck 👋',
    'onboarding_intro': 'Your daily halal bro-check. Stay hard, stay disciplined, stay sincere.',
    'track_your_progress': 'Track Your Progress',
    'onboarding_tracking': 'Check in every day: did you goon or did you fail? But be honest – for yourself and for Allah.',
    'add_some_friends': "Let's Add Some Friends!",
    'onboarding_friends': 'Motivation is stronger with your brothers. Add friends you trust.',
    'onboarding_warning': '⚠️ Never share sins with just anyone.',
    'onboarding_hadith': 'The Prophet ﷺ said: "Everyone from my ummah will be forgiven, except those who openly confess their sins." (Bukhari 6069)',
    'set_goals_get_reminders': 'Set Goals, Get Reminders',
    'onboarding_goals': 'Choose your daily goals. Receive verses from the Quran as motivation. Allah helps those who persevere.',
    'youre_ready_akhi': "You're ready, Akhi 😤",
    'onboarding_ready': 'Take on the challenge. Every day is a new chance to become better.',
    'add_friend': 'Add Friend',
    'i_understand': 'I understand',
    'enter_the_app': 'Enter the App',
    'next': 'Next',
  },
  nl: {
    // General
    'welcome': 'Welkom',
    'loading': 'Laden...',
    'save': 'Opslaan',
    'cancel': 'Annuleren',
    'delete': 'Verwijderen',
    'edit': 'Bewerken',
    'close': 'Sluiten',
    'settings': 'Instellingen',
    'notifications': 'Meldingen',
    'profile': 'Profiel',
    'stay_disciplined': 'Blijf gedisciplineerd, blijf oprecht',
    'create_account': 'Account Aanmaken',
    'sign_in': 'Inloggen',
    'sign_out': 'Uitloggen',
    'honest_agreement': 'Door door te gaan, ga je ermee akkoord eerlijk te zijn tegen jezelf en Allah',
    'display_name': 'Weergavenaam',
    'email': 'E-mail',
    'email_cannot_change': 'E-mail kan niet worden gewijzigd',
    'saving': 'Opslaan...',
    'password': 'Wachtwoord',
    'welcome_back': 'Welkom Terug',
    'welcome_back_akhi': 'Welkom terug, akhi',
    'join_community': 'Word lid van de AkhCheck community',
    'success': 'Succes',
    'error': 'Fout',
    'dont_have_account': 'Geen account?',
    'already_have_account': 'Al een account?',
    'sign_up': 'Registreren',
    'edit_profile': 'Profiel Bewerken',
    'as_salamu_alaykum': 'As-salamu alaykum',
    'theme_settings': 'Thema Instellingen',
    'dark_mode': 'Donkere Modus',
    'light': 'Licht',
    'dark': 'Donker',
    'color_theme': 'Kleurthema',
    'you': 'Jij',
    'quran_verse': '"En wie Allah vreest - Hij zal voor hem een uitweg maken."',
    'quran_reference': '— Koran 65:2',
    
    // Home page
    'daily_challenge': 'Dagelijkse Uitdaging',
    'prayer_times': 'Gebedstijden',
    'streak': 'dagen streak',
    'how_did_you_do': 'Hoe ging het vandaag?',
    'i_succeeded': 'Gelukt',
    'i_gooned': 'Ik gooned',
    'status_updated': 'Status bijgewerkt voor vandaag!',
    
    // Challenges
    'mark_complete': 'Markeer als Voltooid',
    'completed': 'Voltooid! 🎉',
    'easy': 'Makkelijk',
    'medium': 'Gemiddeld',
    'hard': 'Moeilijk',
    
    // Groups
    'groups': 'Groepen',
    'create_group': 'Groep Maken',
    'join_group': 'Groep Joinen',
    'group_chat': 'Groep Chat',
    'members': 'leden',
    'days': 'dagen',
    'daily_checkin': 'Dagelijkse Check-in',
    'i_stayed_disciplined': 'Ik bleef gedisciplineerd',
    'all_checked_in': 'Iedereen heeft vandaag ingecheckt!',
    'streak_maintained': 'Alle leden behielden hun streak',
    'brotherhood_groups': 'Broederschap Groepen',
    'stay_disciplined_with_squad': 'Blijf gedisciplineerd met je squad',
    'how_to_join_group': 'Hoe Een Groep Joinen',
    'ask_friends_for_code': 'Vraag je vrienden om hun Groep Code',
    'group_codes_work_anywhere': 'Groep codes werken overal - geen zelfde netwerk nodig!',
    'unique_8_character_code': 'Elke groep heeft een unieke 8-karakter code',
    'group_codes_shown_below': 'Je groep codes worden hieronder bij elke groep getoond',
    'create_new_group': 'Nieuwe Groep Maken',
    'group_name': 'Groep Naam',
    'group_name_placeholder': 'Halal Squad',
    'create': 'Maken',
    'group_code': 'Groep Code',
    'group_code_placeholder': 'bijv. abc123de',
    'ask_friends_share_code': 'Vraag je vrienden om hun groep code met je te delen',
    'join_brotherhood': 'Broederschap Joinen',
    'loading_groups': 'Groepen laden...',
    'no_groups_yet': 'Nog geen groepen',
    'create_or_join_group': 'Maak of join een groep om te beginnen',
    'share_this_code': 'Deel deze code:',
    'group_created_successfully': 'Groep succesvol aangemaakt!',
    'failed_to_create_group': 'Kon groep niet aanmaken',
    'failed_to_load_groups': 'Kon groepen niet laden',
    'group_not_found': 'Groep niet gevonden',
    'already_member_of_group': 'Je bent al een lid van deze groep',
    'joined_group_successfully': '{groupName} succesvol gejoind!',
    
    // Notifications
    'total_notifications': 'Totaal meldingen',
    'unread': 'Ongelezen',
    'recent_activity': 'Recente Activiteit',
    'mark_all_read': 'Alle Markeren als Gelezen',
    'just_now': 'Zojuist',
    'hours_ago': 'uur geleden',
    'days_ago': 'dagen geleden',
    
    // Settings
    'anonymous_mode': 'Anonieme Modus',
    'hide_status_from_friends': 'Verberg je status voor vrienden',
    'repeat_warnings': 'Herhaalde Waarschuwingen',
    'show_sin_warning_every_time': 'Toon zonde waarschuwing elke keer',
    'daily_reminder': 'Dagelijkse Herinnering',
    'get_reminded_to_check_in': 'Krijg een herinnering om in te checken',
    'reminder_time': 'Herinneringstijd',
    'daily_goals': 'Dagelijkse Doelen',
    'add_custom_goal': 'Aangepast doel toevoegen...',
    
    // Motivational
    'alhamdulillah': 'Alhamdulillah! 🤲',
    'dont_give_up': 'Geef niet op 💚',
    'keep_going': 'Je discipline is geregistreerd!',
    'tomorrow_new_chance': 'Morgen is een nieuwe kans. Maak tawbah en begin opnieuw.',
    
    // Update modal
    'update_title': '🚀 AkhCheck v1.2 – Power Update',
    'update_subtitle': 'Nieuw niveau van discipline en verbinding, akhi.',
    'daily_notifications': '🔔 Dagelijks notificatie systeem',
    'real_notifications': '📢 Echte groep notificaties',
    'dark_theme': '🌙 Licht & Donker thema toggle',
    'custom_goals': '🎯 Aangepaste groep doelen',
    'more_challenges': '🚀 Meer dagelijkse uitdagingen',
    'translate_button': '🌍 Vertaal knop (EN/NL)',
    'sync_fixes': '🔧 Sync fixes & UI verbeteringen',
    'lets_lock_in': "Laten we Lock In 🔥",

    // Onboarding
    'welcome_to_akhcheck': 'Welkom bij AkhCheck 👋',
    'onboarding_intro': 'Jouw dagelijkse halal bro-check. Stay hard, stay disciplined, stay sincere.',
    'track_your_progress': 'Volg Je Voortgang',
    'onboarding_tracking': 'Check elke dag in: ben je gegooned of heb je gefaald? Maar wees eerlijk – voor jezelf én voor Allah.',
    'add_some_friends': 'Laten We Wat Vrienden Toevoegen!',
    'onboarding_friends': 'Motivatie is sterker met je broeders. Voeg vrienden toe die je vertrouwt.',
    'onboarding_warning': '⚠️ Deel nooit zonden met zomaar iemand.',
    'onboarding_hadith': 'De Profeet ﷺ zei: "Iedereen uit mijn ummah zal worden vergeven, behalve degenen die hun zonden openlijk bekennen." (Bukhari 6069)',
    'set_goals_get_reminders': 'Stel Doelen In, Krijg Herinneringen',
    'onboarding_goals': 'Kies jouw dagelijkse doelen. Ontvang ayah\'s uit de Koran als motivatie. Allah helpt de volhouders.',
    'youre_ready_akhi': 'Je bent klaar, Akhi 😤',
    'onboarding_ready': 'Ga de uitdaging aan. Elke dag is een nieuwe kans om beter te worden.',
    'add_friend': 'Vriend Toevoegen',
    'i_understand': 'Ik begrijp het',
    'enter_the_app': 'App Betreden',
    'next': 'Volgende',
  }
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'nl'>(() => {
    return (localStorage.getItem('akhcheck-language') as 'en' | 'nl') || 'en';
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'nl' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('akhcheck-language', newLanguage);
  };

  return (
    <TranslationContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslateButton = () => {
  const { language, toggleLanguage } = useTranslation();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="h-8 px-3 relative z-10"
    >
      <Languages className="w-4 h-4 mr-1" />
      {language.toUpperCase()}
    </Button>
  );
};
