import { useEffect } from 'react';
import { useUserData } from './useUserData';

const themeColors = {
  green: {
    primary: '140 60% 55%',
    primaryGlow: '140 60% 70%',
    accent: '150 50% 50%',
  },
  blue: {
    primary: '220 80% 60%',
    primaryGlow: '220 80% 75%',
    accent: '210 70% 55%',
  },
  purple: {
    primary: '280 100% 70%',
    primaryGlow: '300 100% 80%',
    accent: '270 80% 60%',
  },
};

export const useTheme = () => {
  const { preferences } = useUserData();

  useEffect(() => {
    const theme = preferences?.theme || 'green';
    const colors = themeColors[theme as keyof typeof themeColors];
    
    if (colors) {
      const root = document.documentElement;
      root.style.setProperty('--primary', colors.primary);
      root.style.setProperty('--primary-glow', colors.primaryGlow);
      root.style.setProperty('--accent', colors.accent);
      
      // Update gradient
      root.style.setProperty(
        '--gradient-primary', 
        `linear-gradient(135deg, hsl(${colors.primary}) 0%, hsl(${colors.primaryGlow}) 50%, hsl(${colors.accent}) 100%)`
      );
    }
  }, [preferences?.theme]);

  return { theme: preferences?.theme || 'green' };
};