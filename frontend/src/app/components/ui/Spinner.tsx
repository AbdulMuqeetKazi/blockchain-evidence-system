export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent ${className}`} />
  );
}
