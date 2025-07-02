import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  username: string;
}

export const Header = ({ username }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AkhCheck</h1>
            <p className="text-sm text-muted-foreground">As-salamu alaykum, {username}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};