import { useState } from "react";
import { ShieldCheck, Upload as UploadIcon, AlertTriangle, CheckCircle, User, Clock, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CopyButton } from "../components/CopyButton";
import { parseApiError, verifyEvidence } from "../../services/api";
import { toast } from "sonner";

export function Verify() {
  const [evidenceId, setEvidenceId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to verify");
      return;
    }
    if (!evidenceId) {
      toast.error("Please enter an Evidence ID");
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("evidenceId", evidenceId);

      const result = await verifyEvidence(data);
      const normalized = result?.data || result;
      normalized.valid = normalized?.status === "VALID";
      setVerificationResult(normalized);
      if (normalized.valid) {
        toast.success("Evidence is authentic and matches the blockchain record");
      } else {
        toast.error("Warning: Evidence has been tampered with or does not match!");
      }
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Verify Evidence</h1>
        <p className="text-[#9CA3AF]">Check evidence integrity against blockchain records</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Upload Evidence for Verification</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">Provide file and evidence ID to verify authenticity</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#E5E7EB]">Evidence ID</label>
              <Input
                placeholder="Enter evidence ID (e.g., EV-1234)"
                value={evidenceId}
                onChange={(e) => setEvidenceId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#E5E7EB]">
                Upload File to Verify
              </label>
              <div className="border-2 border-dashed border-[#3B82F6]/30 rounded-lg p-8 text-center hover:border-[#3B82F6]/60 transition-colors">
                <input
                  type="file"
                  id="verify-file-upload"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <label htmlFor="verify-file-upload" className="cursor-pointer">
                  <UploadIcon className="w-12 h-12 mx-auto text-[#3B82F6] mb-3" />
                  {file ? (
                    <p className="text-white font-medium">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-white font-medium mb-1">Click to upload file</p>
                      <p className="text-sm text-[#9CA3AF]">Upload the original evidence file</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ShieldCheck className="w-5 h-5 mr-2" />
              )}
              {loading ? "Verifying..." : "Verify Evidence"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {verificationResult && (
        <Card className={verificationResult.valid ? "border-[#22C55E]/30" : "border-[#EF4444]/30"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Verification Result</h2>
              {verificationResult.valid ? (
                <Badge variant="success" className="text-base px-4 py-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  VALID
                </Badge>
              ) : (
                <Badge variant="error" className="text-base px-4 py-2">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  TAMPERED
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">
                Hash Comparison
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[#9CA3AF]">Stored Hash (Blockchain)</p>
                    <CopyButton text={verificationResult.storedHash} />
                  </div>
                  <div className="bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                    <p className="font-mono text-sm text-white break-all">{verificationResult.storedHash}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[#9CA3AF]">Computed Hash (Uploaded File)</p>
                    <CopyButton text={verificationResult.computedHash} />
                  </div>
                  <div className="bg-[#1F2937]/50 px-4 py-3 rounded-lg border border-[#3B82F6]/20">
                    <p className="font-mono text-sm text-white break-all">{verificationResult.computedHash}</p>
                  </div>
                </div>

                <div className="relative pt-4">
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />
                  <div className={`relative w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                    verificationResult.valid
                      ? "bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/20 border-4 border-[#22C55E]"
                      : "bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 border-4 border-[#EF4444]"
                  }`}>
                    {verificationResult.valid ? (
                      <CheckCircle className="w-16 h-16 text-[#22C55E]" />
                    ) : (
                      <AlertTriangle className="w-16 h-16 text-[#EF4444]" />
                    )}
                  </div>
                  <p className="text-center mt-4 text-lg font-semibold text-white">
                    {verificationResult.valid ? "Hashes Match" : "Hashes Do Not Match"}
                  </p>
                  <p className="text-center text-sm text-[#9CA3AF] mt-1">
                    {verificationResult.valid
                      ? "Evidence has not been tampered with"
                      : "Evidence may have been modified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-sm text-[#9CA3AF]">Owner</p>
                </div>
                <div className="flex items-center justify-between bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                  <p className="font-mono text-sm text-white truncate">{verificationResult.owner}</p>
                  <CopyButton text={verificationResult.owner} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-sm text-[#9CA3AF]">Timestamp</p>
                </div>
                <div className="bg-[#1F2937]/50 px-3 py-2 rounded border border-[#3B82F6]/20">
                  <p className="font-mono text-sm text-white">
                    {new Date(verificationResult.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
