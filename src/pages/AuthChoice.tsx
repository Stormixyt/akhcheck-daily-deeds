import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export const AuthChoice = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="mb-4">
            <div className="w-24 h-24 mx-auto rounded-3xl modern-gradient animate-gradient flex items-center justify-center mb-6 glow-primary animate-float">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center animate-scale-in stagger-1">
                <span className="text-3xl text-primary-foreground font-bold">A</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-slide-in-right stagger-2">
            AkhCheck
          </h1>
          <p className="text-muted-foreground text-lg animate-slide-in-right stagger-3">{t('stay_disciplined')}</p>
        </div>

        {/* Auth Options */}
        <div className="space-y-5 mb-8">
          <Button
            onClick={() => navigate("/auth?mode=signup")}
            className="w-full h-16 rounded-3xl text-lg font-semibold modern-gradient animate-gradient glow-primary hover-lift animate-smooth animate-slide-in-right stagger-4"
            size="lg"
          >
            {t('create_account')}
          </Button>
          
          <Button
            onClick={() => navigate("/auth?mode=login")}
            variant="outline"
            className="w-full h-16 rounded-3xl text-lg font-semibold border-2 glass-card hover-lift animate-smooth animate-slide-in-right stagger-5"
            size="lg"
          >
            {t('sign_in')}
          </Button>
        </div>

        <div className="text-center animate-fade-in-up stagger-5">
          <p className="text-sm text-muted-foreground leading-relaxed px-4">
            {t('honest_agreement')}
          </p>
        </div>
      </div>
    </div>
  );
};