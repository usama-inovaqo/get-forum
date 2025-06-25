export default function ThreadsLoading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Simple loading spinner */}
      <div className="relative">
        <div className="w-8 h-8 border-4 border-transparent border-t-[#7F56D9] border-r-[#7F56D9] rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-[#667085] mt-4">Loading conversation...</p>
    </div>
  );
} 