import { useState } from "react";
import { Upload, ShieldCheck, Send, Clock, Search as SearchIcon, Loader2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { api, parseApiError } from "../../services/api";
import { toast } from "sonner";
import { EvidenceHistory } from "../../types/evidence";

export function History() {
  const [evidenceId, setEvidenceId] = useState("");
  const [timeline, setTimeline] = useState<EvidenceHistory>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceId) {
      toast.error("Please enter an Evidence ID");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const history = await api.getEvidenceHistory(evidenceId);
      setTimeline(history);
    } catch (error) {
      setTimeline([]);
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "upload":
        return <Upload className="w-5 h-5" />;
      case "verify":
        return <ShieldCheck className="w-5 h-5" />;
      case "transfer":
        return <Send className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "upload":
        return "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30";
      case "verify":
        return "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30";
      case "transfer":
        return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30";
      default:
        return "text-[#9CA3AF] bg-white/5 border-white/10";
    }
  };

  const uploads = timeline.filter(t => t.type.toLowerCase() === "upload").length;
  const verifications = timeline.filter(t => t.type.toLowerCase() === "verify").length;
  const transfers = timeline.filter(t => t.type.toLowerCase() === "transfer").length;

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Evidence History</h1>
        <p className="text-[#9CA3AF]">Complete timeline of activities for a specific evidence item</p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Enter evidence ID (e.g., EV-1234) or Hash"
              value={evidenceId}
              onChange={(e) => setEvidenceId(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <SearchIcon className="w-5 h-5 mr-2" />
              )}
              {loading ? "Searching..." : "Search History"}
            </Button>
          </form>
        </CardBody>
      </Card>

      {hasSearched && !loading && timeline.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <Clock className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
            <p className="text-white text-lg font-medium">No history found</p>
            <p className="text-[#9CA3AF] mt-2">There are no blockchain events recorded for this evidence ID.</p>
          </CardBody>
        </Card>
      )}

      {timeline.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardBody className="text-center">
                <Upload className="w-8 h-8 text-[#3B82F6] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{uploads}</p>
                <p className="text-sm text-[#9CA3AF]">Total Uploads</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <ShieldCheck className="w-8 h-8 text-[#22C55E] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{verifications}</p>
                <p className="text-sm text-[#9CA3AF]">Verifications</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <Send className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{transfers}</p>
                <p className="text-sm text-[#9CA3AF]">Transfers</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Chronological record of all transactions</p>
            </CardHeader>
            <CardBody>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3B82F6]/50 via-[#3B82F6]/20 to-transparent" />

                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={item.id || index} className="relative flex gap-6 group">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 ${getActionColor(item.type)} flex items-center justify-center z-10 group-hover:scale-110 transition-transform bg-[#0B0F19]`}>
                        {getActionIcon(item.type)}
                      </div>

                      <div className="flex-1 pb-6">
                        <Card hover className="h-full">
                          <CardBody className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white capitalize">{item.action || item.type}</h3>
                                <Badge variant="info">{item.evidenceId}</Badge>
                              </div>

                              <div className="space-y-1 text-sm">
                                {item.type.toLowerCase() === "transfer" ? (
                                  <p className="text-[#9CA3AF]">
                                    From: <span className="font-mono text-white truncate inline-block max-w-[120px] align-bottom">{item.fromWallet || "Unknown"}</span>
                                    {" → "}
                                    To: <span className="font-mono text-white truncate inline-block max-w-[120px] align-bottom">{item.toWallet || "Unknown"}</span>
                                  </p>
                                ) : (
                                  <p className="text-[#9CA3AF]">
                                    Wallet: <span className="font-mono text-white truncate inline-block max-w-[200px] align-bottom">{item.wallet || "Unknown"}</span>
                                  </p>
                                )}

                                <div className="flex items-center gap-2 text-[#9CA3AF]">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {item.type.toLowerCase() === "upload" && <Badge variant="info">Upload</Badge>}
                              {item.type.toLowerCase() === "verify" && <Badge variant="success">Verify</Badge>}
                              {item.type.toLowerCase() === "transfer" && <Badge variant="warning">Transfer</Badge>}
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
