import { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "blue" | "green" | "red" | "purple";
}

export function StatCard({ title, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  const colors = {
    blue: "from-[#3B82F6]/20 to-[#2563EB]/20 border-[#3B82F6]/30 text-[#3B82F6]",
    green: "from-[#22C55E]/20 to-[#16A34A]/20 border-[#22C55E]/30 text-[#22C55E]",
    red: "from-[#EF4444]/20 to-[#DC2626]/20 border-[#EF4444]/30 text-[#EF4444]",
    purple: "from-[#8B5CF6]/20 to-[#7C3AED]/20 border-[#8B5CF6]/30 text-[#8B5CF6]"
  };

  return (
    <Card hover>
      <CardContent className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#9CA3AF] mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {trend && <p className="text-xs text-[#22C55E]">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[color]} border flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
