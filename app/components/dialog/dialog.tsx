import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Button } from "../buttons/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
      <div className="fixed inset-0 bg-gray-900/75" aria-hidden="true" />
      
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[500px] max-w-lg bg-white rounded-xl shadow-xl relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <div className="px-6 py-6">
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-3 pr-8">
              {title}
            </DialogTitle>
            
            <Description className="text-sm text-gray-600 mb-8 leading-relaxed">
              {description}
            </Description>

            <div className="flex justify-end gap-3">
              <button 
                onClick={onCancel}
                className="w-20 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="w-20 px-4 py-2 text-sm font-medium text-white bg-[#D8265E] border border-transparent rounded-full hover:bg-[#c32256] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8265E]"
              >
                Yes
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
