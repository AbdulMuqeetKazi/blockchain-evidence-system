import { Shield, Wallet, User, LogOut, Edit } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ProfileModal } from "../ProfileModal";

export function Navbar() {
  const { user, displayName, signOut } = useAuth();
  const [connected, setConnected] = useState(false);
  const [address] = useState("0x742d...4e3a");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="h-16 bg-[#0B0F19]/95 backdrop-blur-sm border-b border-[#3B82F6]/20 fixed top-0 left-0 right-0 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Blockchain Evidence System</h1>
              <p className="text-xs text-[#9CA3AF]">Forensic Investigation Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {connected ? (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
                  <span className="text-sm text-[#22C55E] font-mono">{address}</span>
                </div>
                <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
              </div>
            ) : (
              <Button onClick={() => setConnected(true)} size="sm" variant="outline">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-3 py-2 bg-[#1F2937]/50 border border-[#3B82F6]/20 rounded-lg hover:bg-[#1F2937] transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 border border-[#3B82F6]/30 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-[#9CA3AF] truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#1F2937]/95 backdrop-blur-sm border border-[#3B82F6]/20 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-sm font-medium text-white">{displayName}</p>
                      <p className="text-xs text-[#9CA3AF] truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setShowProfileModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-sm">Edit Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
