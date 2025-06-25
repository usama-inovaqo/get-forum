// TODO the conversation container should be loading a conversation in its entirety, not deriving the threads, latest message, etc. from the contacts.
// Maybe make a NextJS route that gets everything and returns a conversation object?
"use client";
import { useState, useCallback, useEffect } from "react";
import {
  ForumContact,
  ForumContactsResponse,
} from "@/app/types/contacts.types";
import Sidebar from "../components/sidebar/sidebar";
import { User } from "@clerk/nextjs/server";
import ForumLogo from "../components/logo/forum-logo";
import ComposerContainer from "../components/composer/composer-container";
import { NylasMessage, NylasMessageWithContact } from "../types/messages.types";
import { ComposedMessage } from "../components/composer/composer.types";
import { Conversation } from "./conversations.types";
import ThreadsContainer from "../components/threads/threads-container";
import { useContacts } from "../hooks/useContacts";

type ConversationContainerProps = {
  initialContacts: ForumContactsResponse;
  user: User;
};

export default function ConversationContainer({
  initialContacts,
  user,
}: ConversationContainerProps) {
  const { contactsResponse, isLoading, error } = useContacts(30000);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [useableContacts, setUseableContacts] =
    useState<ForumContactsResponse>(initialContacts);
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile drawer
  const [messageToRespondTo, setMessageToRespondTo] = useState<
    ComposedMessage | undefined
  >(undefined); // TODO we may not need this piece of state

  const [replyToMessage, setReplyToMessage] = useState<NylasMessage | undefined>(undefined);
  const [dynamicReplies, setDynamicReplies] = useState<NylasMessageWithContact[]>([]);

  // TODO clean this up when upgrading to websockets
  // TODO set conversation isn't working. Fix and then use as key for sidebar.
  const handleComposerSuccess = useCallback(
    (response: NylasMessage | string) => {
      console.log("success: ", response);
      if (!conversation) return;
      if (response && !conversation.selectedContacts.length) {
        const nylasContact = useableContacts.contacts.find(
          (contact) => contact.nylasContact?.emails[0].email === response
        );
        const forumContact: ForumContact | null = nylasContact
          ? {
              email: nylasContact.nylasContact?.emails[0].email || "",
              derivedName: nylasContact.nylasContact?.given_name,
              nylasContact: nylasContact.nylasContact,
            }
          : null;
        if (forumContact) {
          setConversation({
            ...conversation,
            selectedContacts: [forumContact],
          });
        }
      }
      setConversation({
        ...conversation,
        latestMessage: response as NylasMessage,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleRespondToMessage = useCallback((message: NylasMessage) => {
    console.log("handleRespondToMessage: ", message);
    const composedMessage: ComposedMessage = {
      recipients: {
        to: message.from[0].email,
        cc: message.cc.map((cc) => cc.email).join(","),
        bcc: message.bcc.map((bcc) => bcc.email).join(","),
      },
      subject: message.subject,
      body: "",
      replyToMessageId: message.id,
      isReply: false, // This is a regular response, not a direct reply
    };
    setMessageToRespondTo(composedMessage);
    setReplyToMessage(undefined); // Clear any active reply
  }, []);

  const handleReplyToMessage = useCallback((message: NylasMessage) => {
    console.log("handleReplyToMessage: ", message);
    setReplyToMessage(message);
    setMessageToRespondTo(undefined); // Clear any email response
  }, []);

  const handleSendReply = useCallback((replyText: string, originalMessage: NylasMessage) => {
    if (!conversation || !user) return;

    // Create a new message that's a reply to the original
    const newReplyMessage: NylasMessage = {
      starred: false,
      unread: false,
      folders: ["INBOX"],
      subject: originalMessage.subject,
      thread_id: originalMessage.thread_id,
      body: `<p>${replyText}</p>`,
      grant_id: "grant_123",
      id: `reply_${Date.now()}`,
      object: "message",
      snippet: replyText.substring(0, 100),
      bcc: [],
      cc: [],
      attachments: [],
      from: [{ email: user.emailAddresses[0].emailAddress }],
      reply_to: [{ email: user.emailAddresses[0].emailAddress }],
      to: originalMessage.from,
      date: Math.floor(Date.now() / 1000),
      replyToMessageId: originalMessage.id,
    };

    // Find the original message with contact info for proper quoting
    const originalMessageWithContact = useableContacts.contacts.find(
      contact => contact.email === originalMessage.from[0].email
    );

    // Create the message with contact info for display
    const newReplyMessageWithContact: NylasMessageWithContact = {
      ...newReplyMessage,
      derivedContact: {
        email: user.emailAddresses[0].emailAddress,
        derivedName: user.firstName || "You",
        nylasContact: undefined,
      },
      isFromUser: true,
    };

    // Add this message to our dynamic replies
    setDynamicReplies(prev => [...prev, newReplyMessageWithContact]);

    // Also update the conversation's latest message
    setConversation(prev => ({
      ...prev!,
      latestMessage: newReplyMessage,
    }));

    // Clear the reply state
    setReplyToMessage(undefined);
    
    console.log("Reply sent:", newReplyMessage);
  }, [user, conversation, useableContacts]);

  const handleCancelReply = useCallback(() => {
    setReplyToMessage(undefined);
  }, []);

  useEffect(() => {
    if (contactsResponse && !isLoading && !error) {
      setUseableContacts(contactsResponse);
    }
  }, [contactsResponse, isLoading, error]);

  // Clear dynamic replies when conversation changes
  useEffect(() => {
    setDynamicReplies([]);
  }, [conversation?.selectedContacts]);

  console.log("conversation: ", conversation);

  return (
    <div className="h-full">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-lg border border-gray-200"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="h-full overflow-hidden grid grid-cols-10 bg-[#fcfcfd] divide-x-2 divide-[#D0D5DD] text-gray-900">
        {/* Sidebar */}
        <Sidebar
          key={conversation?.selectedContacts.length}
          user={user}
          contacts={useableContacts}
          selectedContacts={conversation?.selectedContacts || []}
          onSetConversation={(contacts) =>
            setConversation({
              ...conversation,
              selectedContacts: contacts,
            })
          }
          isDrawerOpen={sidebarOpen}
          onCloseDrawer={() => setSidebarOpen(false)}
        />
        {/* Empty Conversation (no contacts selected) */}
        <div className="col-span-10 md:col-span-8 h-full flex flex-col justify-between overflow-hidden bg-white">
          {!conversation?.selectedContacts.length && (
            <div className="bg-[#F2F4F7] flex justify-center items-center h-full rounded-xl m-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <ForumLogo />
                <p className="text-sm font-medium text-[#98A2B3]">
                  Select a contact or start a new conversation
                </p>
              </div>
            </div>
          )}

          {/* Conversation Content */}
          {conversation?.selectedContacts.length &&
            conversation?.selectedContacts.length > 0 && (
              <ThreadsContainer
                key={
                  conversation.selectedContacts.length +
                  conversation.selectedContacts[0]?.email
                }
                conversation={conversation}
                onRespondToMessage={handleRespondToMessage}
                onReplyToMessage={handleReplyToMessage}
                replyToMessage={replyToMessage}
                onSendReply={handleSendReply}
                onCancelReply={handleCancelReply}
                dynamicReplies={dynamicReplies}
              />
            )}

          {/* Composer - only show if not replying */}
          {!replyToMessage && (
            <div className="p-4">
              <ComposerContainer
                key={conversation?.selectedContacts[0]?.email ?? "new"}
                contacts={contactsResponse || initialContacts}
                selectedContacts={conversation?.selectedContacts || []}
                disabledForm={!conversation?.selectedContacts.length}
                disabledSend={!conversation?.selectedContacts[0]}
                onSuccess={handleComposerSuccess}
                defaultComposedMessage={messageToRespondTo}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
