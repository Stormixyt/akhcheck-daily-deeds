import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";

export const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">AkhCheck</h1>
          <p className="text-muted-foreground">Stay disciplined, stay sincere</p>
        </div>

        {/* Auth Options */}
        <GlassCard className="p-8 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Welcome</h2>
            <p className="text-sm text-muted-foreground">
              Choose how you want to continue
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/auth?mode=signup")}
              className="w-full h-12"
              size="lg"
            >
              Create Account
            </Button>
            
            <Button
              onClick={() => navigate("/auth?mode=login")}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              Sign In
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to be honest with yourself and Allah
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};