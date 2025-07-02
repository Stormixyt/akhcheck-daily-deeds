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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-2xl text-primary-foreground font-bold">A</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin ? "Welcome back, akhi" : "Join the AkhCheck community"}
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                  placeholder="Abdullah"
                  className="h-12 rounded-xl border-2 bg-card/50 backdrop-blur-sm"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="abdullah@example.com"
                className="h-12 rounded-xl border-2 bg-card/50 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="h-12 rounded-xl border-2 bg-card/50 backdrop-blur-sm"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg mt-6" 
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl border-2 bg-card/50 backdrop-blur-sm text-base font-medium"
            onClick={handleGoogleAuth}
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>

          <div className="text-center pt-4">
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium p-0 h-auto"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};