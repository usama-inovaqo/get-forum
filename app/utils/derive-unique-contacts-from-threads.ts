import { NylasThread } from "../types/threads.types";
import { NylasContact, ForumContact } from "../types/contacts.types";

export function deriveUniqueContactsFromThreads(
  threads: NylasThread[],
  contacts: NylasContact[]
): ForumContact[] {
  return Array.from(
    threads
      .flatMap((thread) =>
        thread.participants.map((participant) => ({
          email: participant.email,
          derivedName: participant.name,
          latestMessage: thread.latest_draft_or_message, // TODO this may not be the latest message
          nylasContact: contacts.find((c) =>
            c.emails.some((e) => e.email === participant.email)
          ),
        }))
      )
      .reduce((map, item) => {
        const existing = map.get(item.email);
        if (
          !existing ||
          (existing.latestMessage?.date ?? 0) < (item.latestMessage?.date ?? 0)
        ) {
          if (item.nylasContact) {
            map.set(item.email, item as ForumContact);
          }
        }
        return map;
      }, new Map<string, ForumContact>())
      .values()
  );
}
