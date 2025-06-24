import { ReactNode } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

export type DropdownProps = {
  button: ReactNode;
  items: ReactNode[];
  anchor?:
    | "top"
    | "left"
    | "bottom"
    | "right"
    | "top start"
    | "top end"
    | "bottom start"
    | "bottom end"
    | "left start"
    | "left end"
    | "right start"
    | "right end";
  menuItemsClassName?: string;
  disabled?: boolean;
};

function Dropdown({
  button,
  items,
  anchor = "bottom end",
  menuItemsClassName = "",
  disabled = false,
}: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        as="div"
        className={`cursor-pointer${
          disabled ? " opacity-50 pointer-events-none" : ""
        }`}
        disabled={disabled}
      >
        {button}
      </MenuButton>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <MenuItems
          anchor={anchor}
          className={`z-10 bg-white rounded-xl shadow-lg py-2 mt-3 focus:outline-none min-w-[10rem] ${menuItemsClassName}`}
        >
          {items.map((item, idx) => (
            <MenuItem key={idx} as="div" className="w-full px-2">
              {item}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

export default Dropdown;
