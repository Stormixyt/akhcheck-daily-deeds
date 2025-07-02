import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Friend {
  id: string;
  username: string;
  streak: number;
  todayStatus: "gooned" | "failed" | null;
}

interface FriendsListProps {
  friends: Friend[];
}

export const FriendsList = ({ friends }: FriendsListProps) => {
  const getStatusIcon = (status: "gooned" | "failed" | null) => {
    switch (status) {
      case "gooned":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: "gooned" | "failed" | null) => {
    switch (status) {
      case "gooned":
        return "Gooned ✅";
      case "failed":
        return "Failed ❌";
      default:
        return "Pending ⏳";
    }
  };

  if (friends.length === 0) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-foreground">No Friends Yet</h3>
          <p className="text-muted-foreground text-sm">
            Add friends with their unique friend code to stay accountable together!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground mb-4">Your Brothers 🤝</h2>
      {friends.map((friend) => (
        <Card key={friend.id} className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h4 className="font-medium text-foreground">{friend.username}</h4>
                <p className="text-sm text-muted-foreground">
                  {friend.streak} day{friend.streak !== 1 ? 's' : ''} streak
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon(friend.todayStatus)}
              <span className="text-sm font-medium text-foreground">
                {getStatusText(friend.todayStatus)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};