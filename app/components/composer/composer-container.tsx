import { ReactNode, useState, useEffect } from "react";
import FullComposer from "./full-composer";
import { ComposerVariant, ComposedMessage } from "./composer.types";
import MiniComposer from "./mini-composer";
import {
  ForumContact,
  ForumContactsResponse,
} from "@/app/types/contacts.types";
import Toast from "../toast/toast";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { trimEmailBody } from "@/app/utils/trim-email-body";
import { NylasMessage } from "@/app/types/messages.types";
import DialogComponent from "../dialog/dialog";
import { ConfirmDialogState } from "../dialog/dialog.types";

type ComposerContainerProps = {
  contacts: ForumContactsResponse;
  selectedContacts: ForumContact[];
  disabledForm?: boolean;
  disabledSend?: boolean;
  onSuccess?: (message: NylasMessage) => void;
  defaultComposedMessage?: ComposedMessage;
};

export default function ComposerContainer({
  contacts,
  selectedContacts,
  disabledForm,
  disabledSend,
  onSuccess,
  defaultComposedMessage,
}: ComposerContainerProps) {
  const [variant, setVariant] = useState<ComposerVariant>(
    defaultComposedMessage ? "full" : "mini"
  );
  const [composedMessage, setComposedMessage] = useState<ComposedMessage>(
    defaultComposedMessage || {
      recipients: {
        to:
          selectedContacts
            .map((contact) => contact.nylasContact?.emails[0].email)
            .join(",") || "",
        cc: "",
        bcc: "",
      },
      subject: selectedContacts[0]?.latestMessage?.subject || "",
      body: "",
    }
  );
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<ReactNode | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    description: "",
    onCancel: () => {},
    onConfirm: () => {},
  });

  const handleSendMessage = async () => {
    if (!composedMessage.body.trim()) return;
    setSending(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock response message
      const mockResponse = {
        starred: false,
        unread: false,
        folders: ["SENT"],
        subject: composedMessage.subject,
        thread_id: `thread_${Date.now()}`,
        body: `<div>${composedMessage.body} <br/><br/><div style="font-style: italic;">sent from forum</div></div>`,
        grant_id: "grant_123",
        id: `msg_${Date.now()}`,
        object: "message" as const,
        snippet: composedMessage.body.substring(0, 100) + "...",
        bcc: [],
        cc: [],
        attachments: [],
        from: [{ email: "user@company.com" }],
        reply_to: [{ email: "user@company.com" }],
        to: [{ email: composedMessage.recipients.to }],
        date: Date.now(),
      };

      setVariant("mini");
      setComposedMessage({
        ...composedMessage,
        body: "",
      });
      setToast("Email sent!");
      console.log("Mock message sent: ", mockResponse);
      onSuccess?.(mockResponse);
    } catch (error) {
      console.log("Failed to send message: ", error);
      setToast(
        <div className="flex flex-col items-center">
          <div>Failed to send message</div>
          <div className="text-xs">Mock error occurred</div>
        </div>
      );
    }
    setSending(false);
  };

  const handleConfirmCloseFullComposer = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Back to conversation view?",
      description:
        "Going back to conversation view will undo your message formatting.",
      onCancel: () =>
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false,
        }),
      onConfirm: handleCloseFullComposer,
    });
  };

  const handleConfirmTrashMessage = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Message?",
      description: "This action cannot be undone.",
      onCancel: () =>
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false,
        }),
      onConfirm: handleTrashMessage,
    });
  };

  const handleCloseFullComposer = () => {
    setVariant("mini");
    // convert the full body to a trimmed body for use in mini composer
    setComposedMessage({
      ...composedMessage,
      body: trimEmailBody(composedMessage.body),
    });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const handleTrashMessage = () => {
    setComposedMessage({
      recipients: { to: "", cc: "", bcc: "" },
      subject: "",
      body: "",
    });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setVariant("mini");
  };

  useEffect(() => {
    setVariant(defaultComposedMessage ? "full" : "mini");
    setComposedMessage(
      defaultComposedMessage || {
        recipients: {
          to:
            selectedContacts
              .map((contact) => contact.nylasContact?.emails[0].email)
              .join(",") || "",
          cc: "",
          bcc: "",
        },
        subject: selectedContacts[0]?.latestMessage?.subject || "",
        body: "",
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultComposedMessage]);

  return (
    <div>
      <div className="flex gap-2 items-center rounded-full bg-white px-4 text-black border border-[#EAECF0] w-full focus-within:ring-1 focus-within:ring-[#101828]">
        <button
          onClick={() => setVariant(variant === "mini" ? "full" : "mini")}
        >
          {variant === "mini" ? (
            <PlusCircleIcon className="w-6 h-6" />
          ) : (
            <MinusCircleIcon className="w-6 h-6" />
          )}
        </button>

        <MiniComposer
          variant={variant}
          composedMessage={composedMessage}
          onChange={setComposedMessage}
          onSendMessage={handleSendMessage}
          sending={sending}
          disabledForm={sending || variant === "full" || disabledForm}
          disabledSend={sending || variant === "full" || disabledSend}
        />

        {variant === "full" && (
          <FullComposer
            contacts={contacts}
            composedMessage={composedMessage}
            onChange={setComposedMessage}
            onSendMessage={handleSendMessage}
            onClose={handleConfirmCloseFullComposer}
            onTrashMessage={handleConfirmTrashMessage}
            disabledForm={sending}
            disabledSend={
              sending ||
              !composedMessage.body.trim() ||
              !composedMessage.recipients.to ||
              !composedMessage.subject
            }
          />
        )}
      </div>
      <DialogComponent
        isOpen={confirmDialog?.isOpen}
        setIsOpen={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title={confirmDialog?.title}
        description={confirmDialog?.description}
        onCancel={confirmDialog?.onCancel}
        onConfirm={confirmDialog?.onConfirm}
      />
      {toast && <Toast message={toast} duration={5000} />}
    </div>
  );
}
