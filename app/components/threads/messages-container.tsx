"use client";
import SingleMessage from "./single-message";
import { useMessages } from "@/app/hooks/useMessages";
import { SkeletonLoader } from "../skeleton-loader/skeleton-loader";
import { useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { NylasMessage } from "@/app/types/messages.types";
import { isMessageFromToday } from "@/app/utils/format-unix-timestamp";

type MessagesContainerProps = {
  messageIds: string[];
  onRespondToMessage: (message: NylasMessage) => void;
};

export default function MessagesContainer({
  messageIds,
  onRespondToMessage,
}: MessagesContainerProps) {
  const { user } = useUser();

  const {
    messages,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useMessages(messageIds, 30000);

  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current && messages?.length > 0) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col-reverse gap-2 overflow-y-auto">
      {isMessagesLoading && (
        <div className="flex flex-col gap-2">
          <div className="px-4">Loading messages...</div>
          <SkeletonLoader boxes={1} />
        </div>
      )}
      {messagesError && <div className="p-4">{messagesError}</div>}
      {messages &&
        user &&
        messages.length > 0 &&
        messages.map((message, index) => {
          // Check if this is the first message (chat beginning)
          const isFirstMessage = index === messages.length - 1;
          
          // Check if "Today" separator has already been shown for a previous message
          const todayAlreadyShown = messages.slice(index + 1).some(msg => 
            isMessageFromToday(msg.date)
          );
          
          // Check if this is the first message of today
          const isFirstMessageOfToday = isMessageFromToday(message.date) && !todayAlreadyShown;
          
          return (
            <div ref={index === 0 ? lastMessageRef : undefined} key={message.id}>
              <SingleMessage
                user={serializedUser}
                message={message}
                onRespondToMessage={onRespondToMessage}
                isFirstMessage={isFirstMessage}
                isFirstMessageOfToday={isFirstMessageOfToday}
              />
            </div>
          );
        })}
    </div>
  );
}
