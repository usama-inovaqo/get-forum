import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ComposedMessage } from "./composer.types";
import {
  ForumContactsResponse,
  NylasContact,
} from "@/app/types/contacts.types";
import { combineRealAndEphemeralContacts } from "./composer.utils";
import ContactsComboboxContainer from "./contacts-combobox-container";
import { splitCommaSeparatedString } from "@/app/utils/split-comma-separated-strings";
import { Button } from "../buttons/button";

type ComposerProps = {
  contacts: ForumContactsResponse;
  composedMessage: ComposedMessage;
  onChange: (composedMessage: ComposedMessage) => void;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onTrashMessage: () => void;
  disabledForm?: boolean;
  disabledSend?: boolean;
};

export default function FullComposer({
  contacts,
  composedMessage,
  onChange,
  onSendMessage,
  onClose,
  onTrashMessage,
  disabledForm,
  disabledSend,
}: ComposerProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCc, setShowCc] = useState(Boolean(composedMessage.recipients.cc));
  const [showBcc, setShowBcc] = useState(
    Boolean(composedMessage.recipients.bcc)
  );

  const handleChangeRecipients = (
    updatedContactsArray: NylasContact[],
    recipientType: "to" | "cc" | "bcc"
  ) => {
    // Get emails from the updated contacts
    const newEmails = updatedContactsArray.map(
      (contact) => contact.emails[0].email
    );

    // Set the recipients directly to the new list
    onChange({
      ...composedMessage,
      recipients: {
        ...composedMessage.recipients,
        [recipientType]: newEmails.join(","),
      },
    });
  };

  return (
    <div>
      <div
        className={`fixed bottom-0 right-4 border-t border-l border-r border-gray-300 bg-white rounded-t-xl shadow-xl ${
          isMaximized ? "w-2/3 " : "w-1/3"
        }`}
      >
        {/* Composer Header */}
        <div className="flex justify-between items-center px-4 py-4 bg-[#f3f4f7] rounded-t-xl">
          <h3 className="text-md font-medium">New Message</h3>
          <div className="flex gap-2">
            <button
              disabled={disabledForm}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:hover:bg-transparent"
              onClick={() => setIsMaximized(!isMaximized)}
            >
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
            <button
              disabled={disabledForm}
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Composer Body */}
        <div
          className={`flex flex-col ${isMaximized ? "h-[700px]" : "h-[500px]"}`}
        >
          <div className="flex justify-between items-start border-b border-gray-300 px-4 py-2">
            <ContactsComboboxContainer
              availableContacts={combineRealAndEphemeralContacts(
                contacts,
                composedMessage.recipients.to
              )}
              selectedContactsAsEmailStrings={splitCommaSeparatedString(
                composedMessage.recipients.to
              )}
              onChange={(updatedContactsArray) =>
                handleChangeRecipients(updatedContactsArray, "to")
              }
              placeholder="Recipients"
            />
            <div className="flex gap-2">
              <button
                disabled={disabledForm}
                onClick={() => setShowCc(!showCc)}
                className="text-sm font-medium disabled:opacity-50"
              >
                Cc
              </button>
              <button
                disabled={disabledForm}
                onClick={() => setShowBcc(!showBcc)}
                className="text-sm font-medium disabled:opacity-50"
              >
                Bcc
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            {showCc && (
              <div className="px-4 py-2 border-b border-gray-300 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500">
                <ContactsComboboxContainer
                  availableContacts={combineRealAndEphemeralContacts(
                    contacts,
                    composedMessage.recipients.cc
                  )}
                  selectedContactsAsEmailStrings={splitCommaSeparatedString(
                    composedMessage.recipients.cc
                  )}
                  onChange={(updatedContactsArray) =>
                    handleChangeRecipients(updatedContactsArray, "cc")
                  }
                  placeholder="Cc"
                />
              </div>
            )}
            {showBcc && (
              <div className="px-4 py-2 border-b border-gray-300 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500">
                <ContactsComboboxContainer
                  availableContacts={combineRealAndEphemeralContacts(
                    contacts,
                    composedMessage.recipients.bcc
                  )}
                  selectedContactsAsEmailStrings={splitCommaSeparatedString(
                    composedMessage.recipients.bcc
                  )}
                  onChange={(updatedContactsArray) =>
                    handleChangeRecipients(updatedContactsArray, "bcc")
                  }
                  placeholder="Bcc"
                />
              </div>
            )}
          </div>

          {/* Subject */}
          <input
            disabled={disabledForm}
            type="text"
            placeholder="Subject"
            className="px-4 py-2 border-b border-gray-300 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
            value={composedMessage.subject}
            onChange={(e) =>
              onChange({ ...composedMessage, subject: e.target.value })
            }
          />

          {/* Editor */}
          <div className="flex-grow">
            <Editor
              disabled={disabledForm ? true : false}
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={composedMessage.body}
              onEditorChange={(content) =>
                disabledForm ? undefined : onChange({ ...composedMessage, body: content })
              }
              init={{
                height: "100%",
                menubar: false,
                auto_focus: disabledForm ? undefined : true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "preview",
                  "emoticons",
                ],
                toolbar:
                  "bold italic underline | bullist numlist | link image emoticons | code | trashMessage sendMessage",
                content_style:
                  'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
                statusbar: false,
                toolbar_location: "top",
                /*setup: (editor) => {
                  editor.ui.registry.addIcon('sendMessage', '<svg class="w-5 h-5 -rotate-45 -translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0721.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path></svg>');
                  editor.ui.registry.addButton('sendMessage', {
                    text: 'Send',
                    icon: 'sendMessage',
                    onAction: () => onSendMessage(composedMessage.body)
                  });
                  
                  // Add custom Trash button
                  editor.ui.registry.addButton('trashMessage', {
                    icon: 'remove',
                    onAction: () => onTrashMessage()
                  });
                },*/
              }}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-300 flex justify-end items-center w-full bg-[#f9fafb]">
            <div className="flex gap-4">
              <button
                disabled={disabledForm}
                className="p-2 rounded-xl hover:bg-white disabled:opacity-50"
                onClick={onTrashMessage}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <Button
                variant="pink"
                size="sm"
                disabled={disabledSend}
                onClick={() => onSendMessage(composedMessage.body)}
              >
                <PaperAirplaneIcon className="w-5 h-5 -rotate-45 -translate-y-0.5" />{" "}
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
