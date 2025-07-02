import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { CheckCircle, Users, Target, BookOpen, ArrowRight } from "lucide-react";

const onboardingSlides = [
  {
    id: 1,
    title: "Welcome to AkhCheck 👋",
    content: "Jouw dagelijkse halal bro-check. Stay hard, stay disciplined, stay sincere.",
    icon: CheckCircle,
  },
  {
    id: 2,
    title: "Track Your Progress",
    content: "Check elke dag in: ben je gegooned of heb je gefaald? Maar wees eerlijk – voor jezelf én voor Allah.",
    icon: Target,
  },
  {
    id: 3,
    title: "Let's Add Some Friends!",
    content: "Motivatie is sterker met je broeders. Voeg vrienden toe die je vertrouwt.",
    warning: "⚠️ Deel nooit zonden met zomaar iemand.",
    hadith: "De Profeet ﷺ zei: 'Iedereen uit mijn ummah zal worden vergeven, behalve degenen die hun zonden openlijk bekennen.' (Bukhari 6069)",
    icon: Users,
    hasAction: true,
  },
  {
    id: 4,
    title: "Set Goals, Get Reminders",
    content: "Kies jouw dagelijkse doelen. Ontvang ayah's uit de Koran als motivatie. Allah helpt de volhouders.",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "You're ready, Akhi 😤",
    content: "Ga de uitdaging aan. Elke dag is een nieuwe kans om beter te worden.",
    icon: CheckCircle,
    isLast: true,
  },
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { updateProfile } = useUserData();

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-border/50">
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {onboardingSlides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index <= currentSlide 
                    ? "bg-primary w-6" 
                    : "bg-muted w-1.5"
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {currentSlideData.title}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-base">
              {currentSlideData.content}
            </p>

            {currentSlideData.warning && (
              <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 space-y-3">
                <p className="text-warning-foreground text-sm font-medium">
                  {currentSlideData.warning}
                </p>
                {currentSlideData.hadith && (
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    {currentSlideData.hadith}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {currentSlideData.hasAction ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleAddFriend} 
                  className="w-full h-12 rounded-2xl text-base font-semibold"
                >
                  Vriend toevoegen
                </Button>
                <Button 
                  onClick={handleNext} 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-2 bg-card/50 backdrop-blur-sm text-base font-medium"
                >
                  Ik begrijp het
                </Button>
              </div>
            ) : currentSlideData.isLast ? (
              <Button 
                onClick={handleComplete} 
                className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg"
                size="lg"
              >
                Enter the App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                className="w-full h-12 rounded-2xl text-base font-semibold"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};