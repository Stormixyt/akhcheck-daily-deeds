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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard className="p-8 text-center space-y-6">
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2">
            {onboardingSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentSlide ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              {currentSlideData.title}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed">
              {currentSlideData.content}
            </p>

            {currentSlideData.warning && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                  {currentSlideData.warning}
                </p>
                {currentSlideData.hadith && (
                  <p className="text-xs text-muted-foreground italic">
                    {currentSlideData.hadith}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {currentSlideData.hasAction ? (
              <div className="space-y-2">
                <Button onClick={handleAddFriend} className="w-full">
                  Vriend toevoegen
                </Button>
                <Button onClick={handleNext} variant="outline" className="w-full">
                  Ik begrijp het
                </Button>
              </div>
            ) : currentSlideData.isLast ? (
              <Button onClick={handleComplete} className="w-full" size="lg">
                Enter the App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};