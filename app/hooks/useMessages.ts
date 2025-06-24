import { useState, useEffect } from "react";
import { NylasMessageWithContact } from "../types/messages.types";
import { mockMessages } from "../data/mock-data";

export function useMessages(
  messageIds: string[],
  refreshInterval = 30000,
  includeTrashed = false
) {
  const [messages, setMessages] = useState<NylasMessageWithContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let isInitialFetch = true;
    setMessages([]);

    async function fetchMessages() {
      if (!messageIds || messageIds.length === 0) {
        setMessages([]);
        setError(null);
        return;
      }

      if (!mounted) return;

      if (isInitialFetch) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Filter mock messages based on messageIds
        let filteredMessages = mockMessages.filter(message => 
          messageIds.includes(message.id)
        );

        if (includeTrashed) {
          filteredMessages = filteredMessages.filter((message) =>
            message.folders?.includes("TRASH")
          );
        } else {
          filteredMessages = filteredMessages.filter(
            (message) => !message.folders?.includes("TRASH")
          );
        }

        if (mounted) {
          setMessages(
            filteredMessages.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (isInitialFetch) {
          setIsLoading(false);
          isInitialFetch = false;
        }
      }
    }

    fetchMessages();
    const intervalId = setInterval(fetchMessages, refreshInterval);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [messageIds, refreshInterval, includeTrashed]);

  return { messages, isLoading, error };
}
