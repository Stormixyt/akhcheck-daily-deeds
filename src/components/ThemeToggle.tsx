import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

export const ThemeToggle = () => {
  const { theme, darkMode, toggleDarkMode, changeTheme } = useTheme();
  const { t } = useTranslation();

  const themeColors = [
    { name: 'green', color: 'bg-green-500', label: 'Green' },
    { name: 'blue', color: 'bg-blue-500', label: 'Blue' },
    { name: 'purple', color: 'bg-purple-500', label: 'Purple' }
  ];

  return (
    <GlassCard className="p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{t('theme_settings')}</h3>
        </div>
        
        {/* Dark/Light Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">{t('dark_mode')}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className="h-8 px-3"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 mr-1" />
                {t('light')}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-1" />
                {t('dark')}
              </>
            )}
          </Button>
        </div>

        {/* Color Theme Selection */}
        <div>
          <span className="text-sm text-foreground block mb-2">{t('color_theme')}</span>
          <div className="flex space-x-2">
            {themeColors.map((themeOption) => (
              <Button
                key={themeOption.name}
                variant={theme === themeOption.name ? "default" : "outline"}
                size="sm"
                onClick={() => changeTheme(themeOption.name as 'green' | 'blue' | 'purple')}
                className="h-8 px-3"
              >
                <div className={`w-3 h-3 rounded-full ${themeOption.color} mr-1`} />
                {themeOption.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};