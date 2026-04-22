import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Hash, Database, FileText, ShieldCheck, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CopyButton } from "../components/CopyButton";
import { getEvidenceById } from "../../services/api";

export function EvidenceDetail() {
  const { id } = useParams();

  const [evidence, setEvidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvidence = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await getEvidenceById(id);
        if (response && response.success) {
          setEvidence(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch evidence details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin mb-4" />
        <p className="text-[#9CA3AF]">Loading evidence details...</p>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Hash className="w-12 h-12 text-[#EF4444] mb-4" />
            <h2 className="text-xl font-semibold text-white">Evidence Not Found</h2>
            <p className="text-[#9CA3AF] mt-2">The requested evidence could not be retrieved.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{evidence.caseName}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="info">{evidence.evidenceId}</Badge>
            {evidence.status === "verified" ? (
              <Badge variant="success">✓ Verified</Badge>
            ) : (
              <Badge variant="error">✗ Tampered</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/verify">
            <Button variant="outline">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Verify Again
            </Button>
          </Link>
          <Button variant="secondary">
            <Send className="w-4 h-4 mr-2" />
            Transfer Ownership
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3B82F6]" />
                <h2 className="text-xl font-semibold text-white">Evidence Metadata</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[#9CA3AF] mb-1">Case Name</p>
                <p className="text-white font-medium">{evidence.caseName}</p>
              </div>

              <div>
                <p className="text-sm text-[#9CA3AF] mb-1">Description</p>
                <p className="text-white leading-relaxed">{evidence.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Evidence Type</p>
                  <Badge variant="default">{evidence.evidenceType || "N/A"}</Badge>
                </div>
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Collection Date</p>
                  <p className="text-white font-mono">{evidence.dateCollected || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Location</p>
                  <p className="text-white">{evidence.location}</p>
                </div>
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Suspect Name</p>
                  <p className="text-white">{evidence.suspectName || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-[#3B82F6]" />
                <h2 className="text-xl font-semibold text-white">Blockchain Information</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">Evidence Hash</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                  <span className="text-sm font-mono text-white break-all">{evidence.hash}</span>
                  <CopyButton text={evidence.hash} />
                </div>
              </div>

              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">Owner Address</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                  <span className="text-sm font-mono text-white">{evidence.owner}</span>
                  <CopyButton text={evidence.owner} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-2">Block Number</p>
                  <div className="bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white">{evidence.blockNumber}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-2">Timestamp</p>
                  <div className="bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white">{evidence.registeredAt || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">Transaction Hash</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                  <span className="text-sm font-mono text-white break-all">{evidence.transactionHash || "N/A"}</span>
                  <CopyButton text={evidence.transactionHash} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#F59E0B]" />
                <h2 className="text-xl font-semibold text-white">IPFS Storage</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">File CID</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#F59E0B]/20">
                  <span className="text-sm font-mono text-white break-all">{evidence.ipfsCid || "N/A"}</span>
                  <CopyButton text={evidence.ipfsCid || ""} />
                </div>
              </div>

              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">Metadata CID</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#F59E0B]/20">
                  <span className="text-sm font-mono text-white break-all">{evidence.metadataCid || "N/A"}</span>
                  <CopyButton text={evidence.metadataCid || ""} />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View on IPFS Gateway
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">File Preview</h3>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-lg border border-[#3B82F6]/20 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-[#3B82F6] mx-auto mb-3" />
                  <p className="text-white font-medium">Evidence File</p>
                  <p className="text-sm text-[#9CA3AF] mt-1">Click to view full size</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verify Evidence
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Download from IPFS
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Export Metadata
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="w-4 h-4 mr-2" />
                Transfer Ownership
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
