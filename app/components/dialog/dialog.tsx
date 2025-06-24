import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Button } from "../buttons/button";

type DialogComponentProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DialogComponent({
  isOpen,
  setIsOpen,
  title,
  description,
  onCancel,
  onConfirm,
}: DialogComponentProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed top-0 inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-80 max-w-lg flex flex-col border bg-white rounded-xl text-gray-900">
          <DialogTitle className="text-xl font-semibold bg-gray-200 py-2 px-4 rounded-t-xl">
            {title}
          </DialogTitle>
          <div className="flex flex-col gap-4 p-4">
            <Description className="text-sm">{description}</Description>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={onCancel} size="sm">
                Cancel
              </Button>
              <Button onClick={onConfirm} size="sm">
                Confirm
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
