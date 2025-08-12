
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Moon, CheckCircle, X, Calendar } from "lucide-react";
import { useFastingTracker } from "@/hooks/useFastingTracker";
import { useTranslation } from "@/hooks/useTranslation";

export const FastingTracker = () => {
  const { t } = useTranslation();
  const { todaysFast, weeklyFasts, startFast, completeFast, breakFast, isRamadan, loading } = useFastingTracker();
  const [selectedFastType, setSelectedFastType] = useState<'ramadan' | 'voluntary' | 'makeup' | 'sunnah'>('voluntary');
  const [breakReason, setBreakReason] = useState('');
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);

  const handleStartFast = async () => {
    await startFast(selectedFastType);
    setShowStartDialog(false);
  };

  const handleBreakFast = async () => {
    await breakFast(breakReason);
    setBreakReason('');
    setShowBreakDialog(false);
  };

  const fastTypeLabels = {
    ramadan: 'Ramadan',
    voluntary: 'Voluntary',
    makeup: 'Makeup',
    sunnah: 'Sunnah'
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Moon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{t('fasting_tracker')}</h3>
        </div>
        <div className="text-center text-muted-foreground">{t('loading')}</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{t('fasting_tracker')}</h3>
        </div>
        {isRamadan && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            Ramadan Kareem 🌙
          </span>
        )}
      </div>

      {!todaysFast ? (
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">{t('no_fast_today')}</p>
          <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Moon className="w-4 h-4 mr-2" />
                {t('start_fast')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('start_fast')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('fast_type')}</label>
                  <Select value={selectedFastType} onValueChange={(value: any) => setSelectedFastType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fastTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleStartFast} className="flex-1">
                    {t('start')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowStartDialog(false)} className="flex-1">
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="font-medium text-foreground">
              {fastTypeLabels[todaysFast.fast_type]} Fast
            </div>
            <div className={`text-sm ${todaysFast.completed ? 'text-success' : todaysFast.broken_reason ? 'text-destructive' : 'text-muted-foreground'}`}>
              {todaysFast.completed ? 'Completed ✅' : 
               todaysFast.broken_reason ? 'Broken ❌' : 
               'In Progress 🌙'}
            </div>
          </div>

          {!todaysFast.completed && !todaysFast.broken_reason && (
            <div className="flex space-x-2">
              <Button 
                onClick={completeFast}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('complete_fast')}
              </Button>
              
              <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    {t('break_fast')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('break_fast')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">{t('reason_optional')}</label>
                      <Textarea
                        value={breakReason}
                        onChange={(e) => setBreakReason(e.target.value)}
                        placeholder="Illness, travel, etc..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleBreakFast} variant="destructive" className="flex-1">
                        {t('confirm')}
                      </Button>
                      <Button variant="outline" onClick={() => setShowBreakDialog(false)} className="flex-1">
                        {t('cancel')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {todaysFast.broken_reason && (
            <div className="text-xs text-muted-foreground p-2 bg-destructive/10 rounded">
              <strong>{t('reason')}:</strong> {todaysFast.broken_reason}
            </div>
          )}
        </div>
      )}

      {weeklyFasts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('this_week')}</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weeklyFasts.slice(0, 7).map((fast, index) => (
              <div
                key={fast.id}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                  fast.completed ? 'bg-success text-success-foreground' :
                  fast.broken_reason ? 'bg-destructive text-destructive-foreground' :
                  'bg-primary text-primary-foreground'
                }`}
              >
                {fast.completed ? '✓' : fast.broken_reason ? '✗' : '•'}
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
