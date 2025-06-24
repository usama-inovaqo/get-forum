import { memo, useMemo } from "react";
import { useThreads } from "@/app/hooks/useThreads";
import { NylasMessage } from "@/app/types/messages.types";
import { Conversation } from "@/app/conversations/conversations.types";
import MessagesContainer from "./messages-container";
import ParticipantsHeader from "../participants-header/participants-header";

type ThreadsProps = {
  conversation: Conversation;
  onRespondToMessage: (message: NylasMessage) => void;
};

const ThreadsContainer = memo(function Threads({
  conversation,
  onRespondToMessage,
}: ThreadsProps) {
  const { threads, isLoading, error } = useThreads(
    conversation.selectedContacts.map((contact) => contact.email),
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
      <div className="flex flex-col gap-2 border-b border-[#D0D5DD] bg-white sticky top-0 mx-4">
        <ParticipantsHeader participants={conversation.selectedContacts} />
      </div>
      <div className="col-span-2 flex gap-4 justify-between h-full overflow-y-auto">
        {isLoading && <div className="p-4">Loading threads...</div>}
        {error && <div className="p-4">{error}</div>}

        {!isLoading && !error && !threads.length && (
          <div className="p-4">No threads found</div>
        )}
        {!isLoading && !error && threads.length > 0 && (
          <div className="w-full h-full flex">
            <MessagesContainer
              messageIds={messageIdsForAllMessagesInThread}
              onRespondToMessage={onRespondToMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default ThreadsContainer;
