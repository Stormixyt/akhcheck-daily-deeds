import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <span className="text-2xl text-primary-foreground font-bold">A</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AkhCheck</h1>
          <p className="text-muted-foreground text-base">Stay disciplined, stay sincere</p>
        </div>

        {/* Auth Options */}
        <div className="space-y-4 mb-8">
          <Button
            onClick={() => navigate("/auth?mode=signup")}
            className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg"
            size="lg"
          >
            Create Account
          </Button>
          
          <Button
            onClick={() => navigate("/auth?mode=login")}
            variant="outline"
            className="w-full h-14 rounded-2xl text-base font-semibold border-2 bg-card/50 backdrop-blur-sm"
            size="lg"
          >
            Sign In
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed px-4">
            By continuing, you agree to be honest with yourself and Allah
          </p>
        </div>
      </div>
    </div>
  );
};