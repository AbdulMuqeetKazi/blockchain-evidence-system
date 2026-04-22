import { useState } from "react";
import { Search as SearchIcon, Hash, FileText, User, Clock, Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { CopyButton } from "../components/CopyButton";
import { parseApiError, getEvidenceById, getEvidenceByHash } from "../../services/api";
import { toast } from "sonner";

export function Search() {
  const [activeTab, setActiveTab] = useState<"id" | "hash">("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    setSearchResult(null);

    try {
      let result;
      if (activeTab === "id") {
        result = await getEvidenceById(searchQuery);
      } else {
        result = await getEvidenceByHash(searchQuery);
      }
      setSearchResult(result?.data || result);
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const ipfsUrl = searchResult?.ipfsCid ? `https://ipfs.io/ipfs/${searchResult.ipfsCid}` : "";

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Search Evidence</h1>
        <p className="text-[#9CA3AF]">Find evidence records by ID or hash</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4 border-b border-white/5 -mb-6 pb-4">
            <button
              onClick={() => setActiveTab("id")}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === "id"
                  ? "text-[#3B82F6] border-b-2 border-[#3B82F6]"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              Search by ID
            </button>
            <button
              onClick={() => setActiveTab("hash")}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === "hash"
                  ? "text-[#3B82F6] border-b-2 border-[#3B82F6]"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              Search by Hash
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder={activeTab === "id" ? "Enter evidence ID (e.g., EV-1234)" : "Enter hash (e.g., 0x8f3a2...)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <SearchIcon className="w-5 h-5 mr-2" />
              )}
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searchResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Case Information</h2>
                  <Badge variant="info">{searchResult.id || searchResult.evidenceId || "Evidence"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">File Name</p>
                  <p className="text-white font-medium">{searchResult.fileName || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Case Name</p>
                  <p className="text-white font-medium">{searchResult.caseName || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-[#9CA3AF] mb-1">Description</p>
                  <p className="text-white leading-relaxed">{searchResult.description || "No description provided."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#9CA3AF] mb-1">Evidence Type</p>
                    <Badge variant="default">{searchResult.evidenceType || "Digital"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-[#9CA3AF] mb-1">Date Collected</p>
                    <p className="text-white font-mono">{searchResult.dateCollected || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#9CA3AF] mb-1">Location</p>
                    <p className="text-white">{searchResult.location || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#9CA3AF] mb-1">Suspect Name</p>
                    <p className="text-white">{searchResult.suspectName || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">File Preview</h2>
              </CardHeader>
              <CardContent>
                {ipfsUrl ? (
                  <div className="aspect-video bg-[#1F2937] rounded-lg border border-[#3B82F6]/20 overflow-hidden relative group">
                     <iframe 
                       src={ipfsUrl} 
                       className="w-full h-full border-0 object-contain" 
                       title="Evidence Preview"
                       sandbox="allow-same-origin allow-scripts"
                     />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                       <a href={ipfsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-medium pointer-events-auto hover:bg-[#2563EB] transition-colors">
                         <ExternalLink className="w-4 h-4" /> Open Full Screen
                       </a>
                     </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-lg border border-[#3B82F6]/20 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-[#3B82F6] mx-auto mb-3" />
                      <p className="text-white font-medium">No File Found</p>
                      <p className="text-sm text-[#9CA3AF] mt-1">IPFS CID is missing</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-[#3B82F6]" />
                  <h3 className="font-semibold text-white">Blockchain Data</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Hash</p>
                  <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white truncate">{searchResult.hash || "N/A"}</span>
                    {searchResult.hash && <CopyButton text={searchResult.hash} />}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Owner</p>
                  <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white truncate">{searchResult.owner || "N/A"}</span>
                    {searchResult.owner && <CopyButton text={searchResult.owner} />}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Timestamp</p>
                  <div className="bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white">
                      {searchResult.timestamp ? new Date(Number(searchResult.timestamp) * 1000).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Registered At</p>
                  <div className="bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white">{searchResult.registeredAt || "N/A"}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Valid Status</p>
                  <div className="bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    {searchResult.isValid !== undefined ? (
                      searchResult.isValid ? (
                        <Badge variant="success">Authentic</Badge>
                      ) : (
                        <Badge variant="error">Tampered</Badge>
                      )
                    ) : (
                      <span className="text-sm font-mono text-[#9CA3AF]">Unknown</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F59E0B]" />
                  <h3 className="font-semibold text-white">IPFS Storage</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">File CID</p>
                  <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#F59E0B]/20">
                    <span className="text-xs font-mono text-white truncate">{searchResult.ipfsCid || "N/A"}</span>
                    {searchResult.ipfsCid && <CopyButton text={searchResult.ipfsCid} />}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Metadata CID</p>
                  <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#F59E0B]/20">
                    <span className="text-xs font-mono text-white truncate">{searchResult.metadataCid || "N/A"}</span>
                    {searchResult.metadataCid && <CopyButton text={searchResult.metadataCid} />}
                  </div>
                </div>

                <a 
                  href={ipfsUrl || "#"} 
                  target={ipfsUrl ? "_blank" : "_self"} 
                  rel="noopener noreferrer" 
                  className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${ipfsUrl ? "text-white border-[#F59E0B] hover:bg-[#F59E0B]/10" : "text-[#9CA3AF] border-white/10 cursor-not-allowed"}`}
                >
                  View on IPFS Gateway
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
