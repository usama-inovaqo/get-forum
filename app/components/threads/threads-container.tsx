import { memo, useMemo } from "react";
import { useThreads } from "@/app/hooks/useThreads";
import { NylasMessage, NylasMessageWithContact } from "@/app/types/messages.types";
import { Conversation } from "@/app/conversations/conversations.types";
import MessagesContainer from "./messages-container";
import ParticipantsHeader from "../participants-header/participants-header";
import ThreadsLoading from "./threads-loading";
import NoThreadsFound from "./no-threads-found";

type ThreadsProps = {
  conversation: Conversation;
  onRespondToMessage: (message: NylasMessage) => void;
  onReplyToMessage: (message: NylasMessage) => void;
  replyToMessage?: NylasMessage;
  onSendReply: (replyText: string, originalMessage: NylasMessage) => void;
  onCancelReply: () => void;
  dynamicReplies: NylasMessageWithContact[];
};

const ThreadsContainer = memo(function Threads({
  conversation,
  onRespondToMessage,
  onReplyToMessage,
  replyToMessage,
  onSendReply,
  onCancelReply,
  dynamicReplies,
}: ThreadsProps) {
  // Memoize participant emails to prevent unnecessary re-renders
  const participantEmails = useMemo(() => {
    return conversation.selectedContacts.map((contact) => contact.email);
  }, [conversation.selectedContacts]);

  const { threads, isLoading, error } = useThreads(
    participantEmails,
    10,
    30000
  );

  // Memoize the message IDs from threads separately
  const threadMessageIds = useMemo(() => {
    return threads.map((thread) => thread.message_ids).flat();
  }, [threads]);

  // Memoize the combined message IDs
  const messageIdsForAllMessagesInThread = useMemo(() => {
    if (
      conversation.latestMessage &&
      !threadMessageIds.includes(conversation.latestMessage.id)
    ) {
      return [...threadMessageIds, conversation.latestMessage.id];
    }
    return threadMessageIds;
  }, [conversation.latestMessage, threadMessageIds]);

  return (
    <div className="h-full overflow-hidden flex flex-col p-4">
      {isLoading ? (
        <ThreadsLoading />
      ) : (
        <>
          <div className="flex flex-col gap-2 border-b border-[#D0D5DD] bg-white sticky top-0 mx-4">
            <ParticipantsHeader participants={conversation.selectedContacts} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            {error && <div className="p-4">{error}</div>}

            {!error && !threads.length && (
              <NoThreadsFound />
            )}
            {!error && threads.length > 0 && (
              <MessagesContainer
                messageIds={messageIdsForAllMessagesInThread}
                onRespondToMessage={onRespondToMessage}
                onReplyToMessage={onReplyToMessage}
                replyToMessage={replyToMessage}
                onSendReply={onSendReply}
                onCancelReply={onCancelReply}
                dynamicReplies={dynamicReplies}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
});

export default ThreadsContainer;
