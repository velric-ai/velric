import { Github, Code, Trophy, MessageCircle, Linkedin, Plus } from "lucide-react";

interface LinkedAccountsSectionProps {
  userData: any;
}

export default function LinkedAccountsSection({ userData }: LinkedAccountsSectionProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "GitHub":
        return <Github size={16} className="text-gray-600" />;
      case "CodeSignal":
        return <Code size={16} className="text-gray-600" />;
      case "HackerRank":
        return <Trophy size={16} className="text-gray-600" />;
      case "Discord":
        return <MessageCircle size={16} className="text-gray-600" />;
      case "LinkedIn":
        return <Linkedin size={16} className="text-gray-600" />;
      default:
        return <Code size={16} className="text-gray-600" />;
    }
  };

  const handleToggleVisibility = (platform: string) => {
    console.log(`Toggle visibility for ${platform}`);
  };

  const getStatusBadgeClass = (account: any) => {
    if (!account.connected) return "";
    return account.isPublic ? "status-badge-public" : "status-badge-private";
  };

  return (
    <div className="glass-card floating-card h-full">
      <div className="p-5">
        <h3 className="text-lg font-semibold glass-text-primary mb-4">Linked Accounts</h3>
        
        <div className="space-y-3">
          {userData.linkedAccounts.map((account: any) => (
            <div
              key={account.platform}
              className="mission-card p-3 transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm">
                    {getPlatformIcon(account.platform)}
                  </div>
                  <div>
                    <p className="text-sm font-medium glass-text-primary">{account.platform}</p>
                    <p className={`text-xs ${account.connected ? "glass-text-accent-positive" : "glass-text-muted"}`}>
                      {account.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {account.connected && (
                    <button
                      onClick={() => handleToggleVisibility(account.platform)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 ${getStatusBadgeClass(account)}`}
                    >
                      {account.isPublic ? "Public" : "Private"}
                    </button>
                  )}
                  
                  {!account.connected && (
                    <button className="status-badge-connected px-3 py-1 text-xs rounded-full font-medium transition-all hover:scale-105">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connect More Platforms Button */}
        <button className="w-full mt-4 glass-card p-3 glass-text-secondary hover:glass-text-primary transition-all hover:scale-105 flex items-center justify-center space-x-2">
          <Plus size={16} />
          <span className="text-sm font-medium">Connect more platforms</span>
        </button>
      </div>
    </div>
  );
}