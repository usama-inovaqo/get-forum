import { useState, useEffect, useMemo } from "react";
import { ForumThreadWithContact, NylasThread } from "../types/threads.types";
import { mockThreads } from "../data/mock-data";

export function useThreads(
  participantEmails?: string[],
  limit: number = 10,
  refreshInterval: number = 30000
) {
  const [threads, setThreads] = useState<NylasThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const isInitialLoad = !isLoaded; // Track if this is the first load

    async function fetchThreads() {
      if (!mounted) return;

      // Only show loading on initial load
      if (isInitialLoad) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 400));

        let filteredThreads = mockThreads;

        // Filter by participant emails if provided
        if (participantEmails && participantEmails.length > 0) {
          filteredThreads = mockThreads.filter(thread =>
            thread.participants.some(participant =>
              participantEmails.includes(participant.email)
            )
          );
        }

        // Apply limit
        filteredThreads = filteredThreads.slice(0, limit);

        if (mounted) {
          // Update threads only if there are changes
          setThreads((prevThreads) => {
            const newThreads = filteredThreads as ForumThreadWithContact[];
            // Only update if the data is different
            if (JSON.stringify(prevThreads) !== JSON.stringify(newThreads)) {
              return newThreads;
            }
            return prevThreads;
          });
          setIsLoaded(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchThreads();
    const intervalId = setInterval(fetchThreads, refreshInterval);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [participantEmails, limit, refreshInterval, isLoaded]);

  // Memoize the return value
  const returnValue = useMemo(() => {
    return { threads, isLoading, isLoaded, error };
  }, [threads, isLoading, isLoaded, error]);

  return returnValue;
}
