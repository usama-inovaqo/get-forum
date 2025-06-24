import { ReactNode } from "react";

type DropdownMenuItemProps = {
  onClick: (e?: React.MouseEvent) => void;
  children: ReactNode;
};

function DropdownMenuItem({ onClick, children }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left hover:bg-[#F9FAFB] p-1 rounded-md"
    >
      {children}
    </button>
  );
}

export default DropdownMenuItem;
