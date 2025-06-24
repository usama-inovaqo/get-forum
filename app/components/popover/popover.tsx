import { ReactNode } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

type PopoverComponentProps = {
  button: ReactNode;
  children: ReactNode;
};

function PopoverComponent({ button, children }: PopoverComponentProps) {
  return (
    <Popover className="relative">
      <PopoverButton>{button}</PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="flex flex-col p-2 rounded-xl bg-white"
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
}

export default PopoverComponent;
