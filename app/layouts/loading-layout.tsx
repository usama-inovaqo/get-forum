import ForumLogo from "../components/logo/forum-logo";

type LoadingLayoutProps = {
  message?: string;
};

export default function LoadingLayout({ message }: LoadingLayoutProps) {
  return (
    <div className="col-span-10 h-full overflow-hidden flex flex-col items-center justify-center p-8 gap-4 font-[family-name:var(--font-geist-sans)] bg-[#13161d]">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="animate-pulse">
          <ForumLogo />
        </div>

        <p className="text-white text-sm font-semibold">
          {message || "Loading Forum..."}
        </p>
      </div>
    </div>
  );
}
