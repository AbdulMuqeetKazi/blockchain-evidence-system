import { useState } from "react";
import { Upload as UploadIcon, File, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CopyButton } from "../components/CopyButton";
import { parseApiError, uploadEvidence } from "../../services/api";
import { toast } from "sonner";
import { useEvidence } from "../contexts/EvidenceContext";

export function Upload() {
  const [useIPFS, setUseIPFS] = useState(true);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { refreshCount } = useEvidence();
  const [formData, setFormData] = useState({
    caseName: "",
    description: "",
    type: "digital",
    location: "",
    date: "",
    suspect: "",
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);
    setUploadResult(null);

    try {
      const data = new FormData();
      data.append("file", formData.file);
      data.append("caseId", formData.caseName);
      data.append("caseName", formData.caseName);
      data.append("description", formData.description);
      data.append("evidenceType", formData.type);
      data.append("location", formData.location);
      data.append("dateCollected", formData.date);
      data.append("suspectName", formData.suspect);
      data.append("useIPFS", useIPFS.toString());

      const result = await uploadEvidence(data);
      setUploadResult(result?.data || result);
      toast.success("Evidence uploaded successfully");
      refreshCount(); // Update dashboard stats
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAll = () => {
    toast.info("Fetching all evidence records is handled on the Dashboard and History pages.");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Evidence</h1>
        <p className="text-[#9CA3AF]">Submit new evidence to the blockchain network</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Evidence Details</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Fill in all required information</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#E5E7EB]">Case Name</label>
                  <Input
                    placeholder="Enter case name"
                    value={formData.caseName}
                    onChange={(e) => setFormData({ ...formData, caseName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#E5E7EB]">Description</label>
                  <Textarea
                    placeholder="Detailed description of the evidence"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#E5E7EB]">Evidence Type</label>
                    <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digital">Digital Evidence</SelectItem>
                        <SelectItem value="physical">Physical Evidence</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="media">Media File</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#E5E7EB]">Location</label>
                    <Input
                      placeholder="Evidence location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#E5E7EB]">Date of Collection</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#E5E7EB]">Suspect Name</label>
                    <Input
                      placeholder="Enter suspect name"
                      value={formData.suspect}
                      onChange={(e) => setFormData({ ...formData, suspect: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#E5E7EB]">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-[#3B82F6]/30 rounded-lg p-8 text-center hover:border-[#3B82F6]/60 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <UploadIcon className="w-12 h-12 mx-auto text-[#3B82F6] mb-3" />
                      {formData.file ? (
                        <p className="text-white font-medium">{formData.file.name}</p>
                      ) : (
                        <>
                          <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                          <p className="text-sm text-[#9CA3AF]">All file types supported (max 100MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-lg">
                  <input
                    type="checkbox"
                    id="ipfs-toggle"
                    checked={useIPFS}
                    onChange={(e) => setUseIPFS(e.target.checked)}
                    className="w-4 h-4 rounded border-[#3B82F6] bg-transparent"
                  />
                  <label htmlFor="ipfs-toggle" className="text-sm text-white cursor-pointer">
                    Use IPFS Storage (Recommended for decentralized storage)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    {loading ? "Uploading..." : "Add Evidence"}
                  </Button>
                  <Button type="button" variant="secondary" size="lg" onClick={handleFetchAll} disabled={loading}>
                    <File className="w-5 h-5 mr-2" />
                    Fetch All
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {uploadResult && (
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  <h3 className="font-semibold text-white">Upload Successful</h3>
                </div>
                <Badge variant="default" className="bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 border-[#22C55E]/20">Confirmed on Blockchain</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Evidence ID</p>
                  <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white">{uploadResult.evidenceId}</span>
                    <CopyButton text={uploadResult.evidenceId?.toString()} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Hash</p>
                  <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white truncate">{uploadResult.hash}</span>
                    <CopyButton text={uploadResult.hash} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Transaction Hash</p>
                  <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white truncate">{uploadResult.transactionHash}</span>
                    <CopyButton text={uploadResult.transactionHash} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Block Number</p>
                  <div className="bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                    <span className="text-sm font-mono text-white">{uploadResult.blockNumber}</span>
                  </div>
                </div>

                {uploadResult.fileCID && (
                  <>
                    <div>
                      <p className="text-xs text-[#9CA3AF] mb-1">File CID</p>
                      <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                        <span className="text-sm font-mono text-white truncate">{uploadResult.fileCID}</span>
                        <div className="flex items-center gap-1">
                          <CopyButton text={uploadResult.fileCID} />
                          <a
                            href={`https://ipfs.io/ipfs/${uploadResult.fileCID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            title="View on IPFS"
                          >
                            <ExternalLink className="w-4 h-4 text-[#3B82F6]" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {uploadResult.metadataCID && (
                      <div>
                        <p className="text-xs text-[#9CA3AF] mb-1">Metadata CID</p>
                        <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                          <span className="text-sm font-mono text-white truncate">{uploadResult.metadataCID}</span>
                          <div className="flex items-center gap-1">
                            <CopyButton text={uploadResult.metadataCID} />
                            <a
                              href={`https://ipfs.io/ipfs/${uploadResult.metadataCID}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded hover:bg-white/10 transition-colors"
                              title="View on IPFS"
                            >
                              <ExternalLink className="w-4 h-4 text-[#3B82F6]" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
