import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { Chrome } from "lucide-react";

export const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode === 'login' || mode !== 'signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
            data: {
              display_name: displayName,
            },
          },
        });
        if (error) throw error;
        toast({
          title: t('success'),
          description: "Account created! Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo Section */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-24 h-24 mx-auto rounded-3xl modern-gradient animate-gradient flex items-center justify-center mb-6 glow-primary animate-pulse-glow">
            <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center animate-scale-in stagger-1">
              <span className="text-3xl text-primary-foreground font-bold">A</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-slide-in-right stagger-2">
            {isLogin ? t('welcome_back') : t('create_account')}
          </h1>
          <p className="text-muted-foreground text-base animate-slide-in-right stagger-3">
            {isLogin ? t('welcome_back_akhi') : t('join_community')}
          </p>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-3 animate-slide-in-right stagger-4">
                <Label htmlFor="displayName" className="text-base font-medium text-foreground">{t('display_name')}</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                  placeholder="Abdullah"
                  className="h-14 rounded-2xl border-2 glass-card text-base animate-smooth hover-lift focus:glow-primary"
                />
              </div>
            )}
            
            <div className="space-y-3 animate-slide-in-right stagger-4">
              <Label htmlFor="email" className="text-base font-medium text-foreground">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="abdullah@example.com"
                className="h-14 rounded-2xl border-2 glass-card text-base animate-smooth hover-lift focus:glow-primary"
              />
            </div>

            <div className="space-y-3 animate-slide-in-right stagger-5">
              <Label htmlFor="password" className="text-base font-medium text-foreground">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="h-14 rounded-2xl border-2 glass-card text-base animate-smooth hover-lift focus:glow-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-3xl text-lg font-semibold modern-gradient animate-gradient glow-primary animate-spring mt-8 transform-gpu" 
              disabled={loading}
              style={{ 
                transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                willChange: 'transform, box-shadow'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate3d(0, -2px, 0) scale(1.01)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate3d(0, 0, 0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              }}
            >
              {loading ? t('loading') : isLogin ? t('sign_in') : t('create_account')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="glass-card px-4 py-2 rounded-xl text-muted-foreground font-medium">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-16 rounded-3xl border-2 glass-card text-lg font-medium transform-gpu"
            onClick={handleGoogleAuth}
            style={{ 
              transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
              willChange: 'transform, box-shadow, border-color'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate3d(0, -2px, 0) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 0 25px hsl(280 100% 70% / 0.2)';
              e.currentTarget.style.borderColor = 'hsl(280 100% 70% / 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate3d(0, 0, 0) scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glass)';
              e.currentTarget.style.borderColor = 'hsl(var(--glass-border))';
            }}
          >
            <Chrome className="w-6 h-6 mr-3" />
            Continue with Google
          </Button>

          <div className="text-center pt-6">
            <p className="text-muted-foreground text-base mb-2">
              {isLogin ? t('dont_have_account') : t('already_have_account')}
            </p>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold text-base p-0 h-auto hover:text-accent animate-smooth"
            >
              {isLogin ? t('sign_up') : t('sign_in')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};