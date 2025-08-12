
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircle, Users, Target, BookOpen, ArrowRight } from "lucide-react";

const onboardingSlides = [
  {
    id: 1,
    title: "welcome_to_akhcheck",
    content: "onboarding_intro",
    icon: CheckCircle,
  },
  {
    id: 2,
    title: "track_your_progress",
    content: "onboarding_tracking",
    icon: Target,
  },
  {
    id: 3,
    title: "add_some_friends",
    content: "onboarding_friends",
    warning: "onboarding_warning",
    hadith: "onboarding_hadith",
    icon: Users,
    hasAction: true,
  },
  {
    id: 4,
    title: "set_goals_get_reminders",
    content: "onboarding_goals",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "youre_ready_akhi",
    content: "onboarding_ready",
    icon: CheckCircle,
    isLast: true,
  },
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { updateProfile } = useUserData();
  const { t } = useTranslation();

  const currentSlideData = onboardingSlides[currentSlide];

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleComplete = async () => {
    await updateProfile({ onboarding_completed: true });
    navigate("/");
  };

  const handleAddFriend = () => {
    // TODO: Implement friend adding functionality
    handleNext();
  };

  const IconComponent = currentSlideData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="glass-card rounded-3xl p-10 text-center shadow-2xl animate-fade-in-up">
          {/* Progress indicators */}
          <div className="flex justify-center space-x-3 mb-10 animate-scale-in stagger-1">
            {onboardingSlides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full animate-spring ${
                  index <= currentSlide 
                    ? "modern-gradient animate-gradient w-8 glow-primary" 
                    : "bg-muted w-2"
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-8 animate-float">
            <div className="w-28 h-28 rounded-3xl modern-gradient animate-gradient flex items-center justify-center glow-primary">
              <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center animate-scale-in stagger-2">
                <IconComponent className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 mb-10 animate-slide-in-right">
            <h2 className="text-3xl font-bold text-foreground leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t(currentSlideData.title)}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t(currentSlideData.content)}
            </p>

            {currentSlideData.warning && (
              <div className="glass-card border border-warning/30 rounded-3xl p-6 space-y-4 glow-primary">
                <p className="text-warning text-base font-semibold">
                  {t(currentSlideData.warning)}
                </p>
                {currentSlideData.hadith && (
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {t(currentSlideData.hadith)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {currentSlideData.hasAction ? (
              <div className="space-y-4">
                <Button 
                  onClick={handleAddFriend} 
                  className="w-full h-16 rounded-3xl text-lg font-semibold modern-gradient glow-primary hover-lift animate-spring"
                >
                  {t('add_friend')}
                </Button>
                <Button 
                  onClick={handleNext} 
                  variant="outline" 
                  className="w-full h-16 rounded-3xl border-2 glass-card text-lg font-medium hover-lift animate-smooth"
                >
                  {t('i_understand')}
                </Button>
              </div>
            ) : currentSlideData.isLast ? (
              <Button 
                onClick={handleComplete} 
                className="w-full h-18 rounded-3xl text-lg font-semibold modern-gradient glow-primary hover-lift animate-bounce-custom"
                size="lg"
              >
                {t('enter_the_app')}
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                className="w-full h-16 rounded-3xl text-lg font-semibold modern-gradient glow-primary hover-lift animate-spring"
              >
                {t('next')}
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
