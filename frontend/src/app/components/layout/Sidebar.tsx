import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Upload,
  ShieldCheck,
  Search,
  History,
  Database,
  Network
} from "lucide-react";
import { useEvidence } from "../../contexts/EvidenceContext";

export function Sidebar() {
  const location = useLocation();
  const { totalCount, isConnected } = useEvidence();
  const error = !isConnected;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/upload", label: "Upload Evidence", icon: Upload },
    { path: "/verify", label: "Verify Evidence", icon: ShieldCheck },
    { path: "/search", label: "Search", icon: Search },
    { path: "/history", label: "History", icon: History },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#0B0F19]/95 backdrop-blur-sm border-r border-[#3B82F6]/20 fixed top-16 left-0 bottom-0 overflow-y-auto">
      <div className="p-4 space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3 px-3">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${isActive(item.path)
                      ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30"
                      : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3 py-4 rounded-lg bg-gradient-to-br from-[#3B82F6]/10 to-[#2563EB]/10 border border-[#3B82F6]/20">
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-[#3B82F6]" />
            <p className="text-sm font-semibold text-white">Network Status</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">API Status:</span>
              <span className={error ? "text-red-400 font-medium" : "text-white font-medium"}>
                {error ? "Offline" : "Online"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Backend:</span>
              <span className="text-white font-medium font-mono">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-red-500' : 'bg-[#22C55E]'}`} />
              <span className={error ? "text-red-500" : "text-[#22C55E]"}>
                {error ? "Connection Error" : "Connected"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 py-4 rounded-lg bg-gradient-to-br from-[#1F2937]/50 to-[#111827]/50 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-[#9CA3AF]" />
            <p className="text-sm font-semibold text-white">Storage</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">IPFS Node:</span>
              <span className="text-[#22C55E]">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Files:</span>
              <span className="text-white font-medium">{totalCount}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
