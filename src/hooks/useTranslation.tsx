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
    
    // Notifications
    'total_notifications': 'Total notifications',
    'unread': 'Unread',
    'recent_activity': 'Recent Activity',
    'mark_all_read': 'Mark All as Read',
    'just_now': 'Just now',
    'hours_ago': 'hours ago',
    'days_ago': 'days ago',
    
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
    
    // Notifications
    'total_notifications': 'Totaal meldingen',
    'unread': 'Ongelezen',
    'recent_activity': 'Recente Activiteit',
    'mark_all_read': 'Alle Markeren als Gelezen',
    'just_now': 'Zojuist',
    'hours_ago': 'uur geleden',
    'days_ago': 'dagen geleden',
    
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