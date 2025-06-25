"use client";
import SingleMessage from "./single-message";
import { useMessages } from "@/app/hooks/useMessages";
import { SkeletonLoader } from "../skeleton-loader/skeleton-loader";
import { useRef, useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import {
  NylasMessage,
  NylasMessageWithContact,
} from "@/app/types/messages.types";
import { isMessageFromToday } from "@/app/utils/format-unix-timestamp";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

type MessagesContainerProps = {
  messageIds: string[];
  onRespondToMessage: (message: NylasMessage) => void;
  onReplyToMessage: (message: NylasMessage) => void;
  replyToMessage?: NylasMessage;
  onSendReply: (replyText: string, originalMessage: NylasMessage) => void;
  onCancelReply: () => void;
  dynamicReplies: NylasMessageWithContact[];
};

export default function MessagesContainer({
  messageIds,
  onRespondToMessage,
  onReplyToMessage,
  replyToMessage,
  onSendReply,
  onCancelReply,
  dynamicReplies,
}: MessagesContainerProps) {
  const { user } = useUser();
  const [replyText, setReplyText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const {
    messages: fetchedMessages,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useMessages(messageIds, 30000);

  // Combine fetched messages with dynamic replies, sorted oldest to newest
  const allMessages = useMemo(() => {
    if (!fetchedMessages) return [];
    const sortedFetchedMessages = [...fetchedMessages].sort(
      (a, b) => a.date - b.date
    );
    return [...sortedFetchedMessages, ...dynamicReplies];
  }, [fetchedMessages, dynamicReplies]);

  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (messagesContainerRef.current) {
        setIsOverflowing(
          messagesContainerRef.current.scrollHeight >
            messagesContainerRef.current.clientHeight
        );
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [allMessages]);

  useEffect(() => {
    if (lastMessageRef.current && messagesContainerRef.current) {
      // Only auto-scroll if user is already near the bottom or if it's the first load
      const container = messagesContainerRef.current;
      const isNearBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100;

      if (isNearBottom || allMessages.length === 1) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  }, [allMessages]);

  // Helper function to find the message that another message is replying to
  const findReplyToMessage = (
    message: NylasMessage | NylasMessageWithContact
  ) => {
    if (!message.replyToMessageId || !allMessages) return undefined;
    return allMessages.find((msg) => msg.id === message.replyToMessageId);
  };

  const handleSendReply = () => {
    if (replyText.trim() && replyToMessage) {
      onSendReply(replyText.trim(), replyToMessage);
      setReplyText("");
    }
  };

  const handleCancelReply = () => {
    setReplyText("");
    onCancelReply();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  // Calculate separator states once for all messages for a top-down view
  const separatorStates = useMemo(() => {
    if (!allMessages || allMessages.length === 0) return [];

    const firstTodayIndex = allMessages.findIndex((m) =>
      isMessageFromToday(m.date)
    );
    const firstUnreadIndex = allMessages.findIndex((m) => m.unread);

    return allMessages.map((message, index) => {
      const isFirstMessage = index === 0;
      const isFirstOfToday =
        index === firstTodayIndex && firstTodayIndex !== -1;
      const isFirstUnread =
        index === firstUnreadIndex && firstUnreadIndex !== -1;

      const showChatBeginning = isFirstMessage;
      const showTodaySeparator = isFirstOfToday && !showChatBeginning;
      const showNewSeparator =
        isFirstUnread && !showChatBeginning && !showTodaySeparator;

      return {
        showChatBeginning,
        showTodaySeparator,
        showNewSeparator,
      };
    });
  }, [allMessages]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div
        ref={messagesContainerRef}
        className="flex-1 flex flex-col gap-2 overflow-y-auto"
      >
        {isMessagesLoading && (
          <div className="flex flex-col gap-2">
            <div className="px-4">Loading messages...</div>
            <SkeletonLoader boxes={1} />
          </div>
        )}
        {messagesError && <div className="p-4">{messagesError}</div>}
        {/* Spacer for short conversations */}
        {!isOverflowing && <div className="flex-1"></div>}

        {allMessages &&
          user &&
          allMessages.length > 0 &&
          allMessages.map((message, index) => {
            const replyToMsg = findReplyToMessage(message);
            const separators = separatorStates[index];

            return (
              <div
                ref={
                  index === allMessages.length - 1 ? lastMessageRef : undefined
                }
                key={message.id}
              >
                <SingleMessage
                  user={serializedUser}
                  message={message}
                  onRespondToMessage={onRespondToMessage}
                  onReplyToMessage={onReplyToMessage}
                  isFirstMessage={separators.showChatBeginning}
                  isFirstMessageOfToday={separators.showTodaySeparator}
                  showNewSeparator={separators.showNewSeparator}
                  replyToMessage={replyToMsg}
                  applyTopMargin={isOverflowing && separators.showChatBeginning}
                />
              </div>
            );
          })}
      </div>
      <div className="flex items-center gap-4 h-2 text-[#E4E7EC] text-sm">
        <span className="w-full border-t border-[#E4E7EC] mb-4 mx-4"></span>
      </div>

      {/* Inline Reply Composer */}
      {replyToMessage && (
        <div className="border-t border-[#E4E7EC] bg-white p-4 mt-2">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-sm text-[#667085] font-medium">
              Replying to {replyToMessage.from[0].email}
            </span>
            <button
              onClick={handleCancelReply}
              className="p-1 hover:bg-[#E4E7EC] rounded text-[#667085]"
              title="Cancel reply"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your reply..."
              className="flex-1 p-3 border border-[#E4E7EC] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#101828] focus:border-[#101828]"
              rows={3}
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="px-4 py-2 bg-[#101828] text-white rounded-lg hover:bg-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
