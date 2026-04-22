import { FileText, ShieldCheck, AlertTriangle, Database, ArrowRight, Clock } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/Badge";
import { Link } from "react-router";
import { useEvidence } from "../contexts/EvidenceContext";

export function Dashboard() {
  const { totalCount, isConnected } = useEvidence();

  // No backend endpoint for recent activity, leaving empty state
  const recentActivity: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[#9CA3AF]">Overview of blockchain evidence system activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Evidence"
          value={totalCount.toString()}
          icon={FileText}
          trend={isConnected ? "Live Data" : "Connecting..."}
          color="blue"
        />
        <StatCard
          title="Verified Records"
          value="--"
          icon={ShieldCheck}
          trend="Calculated on verify"
          color="green"
        />
        <StatCard
          title="Tampered Records"
          value="--"
          icon={AlertTriangle}
          trend="Calculated on verify"
          color="red"
        />
        <StatCard
          title="Network"
          value="Sepolia"
          icon={Database}
          color={isConnected ? "green" : "purple"}
          trend={isConnected ? "Connected" : "Disconnected"}
        />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Evidence Flow</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">How evidence is stored and verified</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 border border-[#3B82F6]/30 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-8 h-8 text-[#3B82F6]" />
              </div>
              <p className="text-center text-sm font-medium text-white">User Upload</p>
              <p className="text-center text-xs text-[#9CA3AF] mt-1">Evidence + Metadata</p>
            </div>

            <ArrowRight className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />

            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/20 border border-[#8B5CF6]/30 rounded-lg flex items-center justify-center mb-2">
                <Database className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <p className="text-center text-sm font-medium text-white">Backend Processing</p>
              <p className="text-center text-xs text-[#9CA3AF] mt-1">Hash Generation</p>
            </div>

            <ArrowRight className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />

            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 border border-[#F59E0B]/30 rounded-lg flex items-center justify-center mb-2">
                <Database className="w-8 h-8 text-[#F59E0B]" />
              </div>
              <p className="text-center text-sm font-medium text-white">IPFS Storage</p>
              <p className="text-center text-xs text-[#9CA3AF] mt-1">Distributed Storage</p>
            </div>

            <ArrowRight className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />

            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/20 border border-[#22C55E]/30 rounded-lg flex items-center justify-center mb-2">
                <ShieldCheck className="w-8 h-8 text-[#22C55E]" />
              </div>
              <p className="text-center text-sm font-medium text-white">Blockchain</p>
              <p className="text-center text-xs text-[#9CA3AF] mt-1">Immutable Record</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Latest evidence submissions and verifications</p>
            </div>
            <Link to="/history">
              <button className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-medium">
                View All →
              </button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Evidence ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Case Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#9CA3AF]">
                      No recent activity found.
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/evidence/${item.id}`} className="text-[#3B82F6] hover:text-[#2563EB] font-mono font-medium">
                          {item.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-white">{item.caseName}</td>
                      <td className="px-6 py-4">
                        {item.status === "verified" ? (
                          <Badge variant="success">✓ Verified</Badge>
                        ) : (
                          <Badge variant="error">✗ Tampered</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF] font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {item.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF] font-mono text-sm">
                        {item.hash}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
