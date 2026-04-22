import { useParams, Link } from "react-router";
import { ArrowLeft, Hash, Database, FileText, ShieldCheck, Send, Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { CopyButton } from "../components/CopyButton";

export function EvidenceDetail() {
  const { id } = useParams();

  const evidence = {
    evidenceId: id,
    caseName: "Digital Forensics Case #445",
    description: "Evidence collected from cybercrime investigation involving unauthorized access to secure systems. Multiple digital artifacts including log files, network captures, and system snapshots were recovered during the initial response phase.",
    type: "Digital Evidence",
    location: "Server Room A, Building 3",
    date: "2026-04-15",
    suspect: "John Doe",
    hash: "0x8f3a2b5c7d9e1f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a",
    owner: "0x742d35Cc6634C0532925a3b844Bc9e4e3e4e4e3a",
    timestamp: "2026-04-15 14:23:45",
    blockNumber: 5234891,
    transactionHash: "0x9d4e3f2a1b0c8d6e4f2a0b8c6d4e2f0a8b6c4d2e0f8a6b4c2d0e8f6a4b2c0d8e",
    fileCID: "QmX9Z8K2hJ4vN5mP7rQ3sT6uY8wB1cD2eF4gH5iJ6kL7mN",
    metadataCID: "QmP7Q8R9sT0uV1wX2yZ3aB4cD5eF6gH7iJ8kL9mN0oP1q",
    status: "verified"
  };

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
            <CardBody className="space-y-4">
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
                  <Badge variant="default">{evidence.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Collection Date</p>
                  <p className="text-white font-mono">{evidence.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Location</p>
                  <p className="text-white">{evidence.location}</p>
                </div>
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Suspect Name</p>
                  <p className="text-white">{evidence.suspect}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-[#3B82F6]" />
                <h2 className="text-xl font-semibold text-white">Blockchain Information</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
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
                    <span className="text-sm font-mono text-white">{evidence.timestamp}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">Transaction Hash</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                  <span className="text-sm font-mono text-white break-all">{evidence.transactionHash}</span>
                  <CopyButton text={evidence.transactionHash} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#F59E0B]" />
                <h2 className="text-xl font-semibold text-white">IPFS Storage</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">File CID</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#F59E0B]/20">
                  <span className="text-sm font-mono text-white break-all">{evidence.fileCID}</span>
                  <CopyButton text={evidence.fileCID} />
                </div>
              </div>

              <div>
                <p className="text-sm text-[#9CA3AF] mb-2">Metadata CID</p>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#F59E0B]/20">
                  <span className="text-sm font-mono text-white break-all">{evidence.metadataCID}</span>
                  <CopyButton text={evidence.metadataCID} />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View on IPFS Gateway
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">File Preview</h3>
            </CardHeader>
            <CardBody>
              <div className="aspect-square bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-lg border border-[#3B82F6]/20 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-[#3B82F6] mx-auto mb-3" />
                  <p className="text-white font-medium">Evidence File</p>
                  <p className="text-sm text-[#9CA3AF] mt-1">Click to view full size</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">Quick Actions</h3>
            </CardHeader>
            <CardBody className="space-y-2">
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
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
