import { useState, useEffect } from "react";
import { ForumContactsResponse } from "../types/contacts.types";
import { mockContactsResponse } from "../data/mock-data";

export function useContacts(refreshInterval = 30000) {
  const [contactsResponse, setContactsResponse] =
    useState<ForumContactsResponse | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setContactsResponse({
      contacts: [],
      nonContacts: [],
      teamContacts: [],
    });

    setIsLoaded(false);

    async function fetchContacts() {
      if (!mounted) return;

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (mounted) {
          setContactsResponse(mockContactsResponse);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Error in fetchContacts:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchContacts();
    const intervalId = setInterval(fetchContacts, refreshInterval);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return { contactsResponse, isLoading, isLoaded, error };
}
