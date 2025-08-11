import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { useTranslation } from "@/hooks/useTranslation";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, updateProfile } = useUserData();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    
    setSaving(true);
    await updateProfile({ display_name: displayName.trim() });
    setSaving(false);
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/settings")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{t('edit_profile')}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">{t('display_name')}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Abdullah"
              />
            </div>

            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                value={profile?.email || ""}
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('email_cannot_change')}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/settings")}
                className="flex-1"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !displayName.trim()}
                className="flex-1"
              >
                {saving ? t('saving') : t('save')}
              </Button>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};