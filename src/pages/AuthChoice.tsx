import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in-up">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="mb-4">
            <div className="w-24 h-24 mx-auto rounded-3xl modern-gradient flex items-center justify-center mb-6 glow-primary animate-float">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
                <span className="text-3xl text-primary-foreground font-bold">A</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AkhCheck
          </h1>
          <p className="text-muted-foreground text-lg">Stay disciplined, stay sincere</p>
        </div>

        {/* Auth Options */}
        <div className="space-y-5 mb-8 animate-slide-in-right">
          <Button
            onClick={() => navigate("/auth?mode=signup")}
            className="w-full h-16 rounded-3xl text-lg font-semibold modern-gradient glow-primary hover-lift animate-smooth"
            size="lg"
          >
            Create Account
          </Button>
          
          <Button
            onClick={() => navigate("/auth?mode=login")}
            variant="outline"
            className="w-full h-16 rounded-3xl text-lg font-semibold border-2 glass-card hover-lift animate-smooth"
            size="lg"
          >
            Sign In
          </Button>
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-muted-foreground leading-relaxed px-4">
            By continuing, you agree to be honest with yourself and Allah
          </p>
        </div>
      </div>
    </div>
  );
};