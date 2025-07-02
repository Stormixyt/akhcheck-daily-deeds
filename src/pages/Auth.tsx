import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
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
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in-up">
      <div className="w-full max-w-sm">
        {/* Logo Section */}
        <div className="text-center mb-10 animate-scale-in">
          <div className="w-24 h-24 mx-auto rounded-3xl modern-gradient flex items-center justify-center mb-6 glow-primary animate-pulse-glow">
            <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
              <span className="text-3xl text-primary-foreground font-bold">A</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground text-base">
            {isLogin ? "Welcome back, akhi" : "Join the AkhCheck community"}
          </p>
        </div>

        <div className="space-y-8 animate-slide-in-right">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-3">
                <Label htmlFor="displayName" className="text-base font-medium text-foreground">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                  placeholder="Abdullah"
                  className="h-14 rounded-2xl border-2 glass-card text-base animate-smooth focus:glow-primary"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="abdullah@example.com"
                className="h-14 rounded-2xl border-2 glass-card text-base animate-smooth focus:glow-primary"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-medium text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="h-14 rounded-2xl border-2 glass-card text-base animate-smooth focus:glow-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-3xl text-lg font-semibold modern-gradient glow-primary hover-lift animate-spring mt-8" 
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
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
            className="w-full h-16 rounded-3xl border-2 glass-card text-lg font-medium hover-lift animate-smooth"
            onClick={handleGoogleAuth}
          >
            <Chrome className="w-6 h-6 mr-3" />
            Continue with Google
          </Button>

          <div className="text-center pt-6">
            <p className="text-muted-foreground text-base mb-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold text-base p-0 h-auto hover:text-accent animate-smooth"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};