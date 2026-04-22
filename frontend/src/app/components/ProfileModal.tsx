import { useState } from "react";
import { X, User, Save } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, displayName, setDisplayName } = useAuth();
  const [name, setName] = useState(displayName);

  if (!isOpen) return null;

  const handleSave = () => {
    setDisplayName(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-br from-[#111827]/95 to-[#1F2937]/95 backdrop-blur-sm border border-[#3B82F6]/20 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 border border-[#3B82F6]/30 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#9CA3AF]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Email
            </label>
            <div className="px-4 py-2.5 bg-[#1F2937]/50 border border-[#3B82F6]/20 rounded-lg">
              <p className="text-white font-mono text-sm">{user?.email}</p>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">Email cannot be changed</p>
          </div>

          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your display name"
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} size="lg" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={onClose} variant="secondary" size="lg">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
