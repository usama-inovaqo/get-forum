import { User } from "@sentry/nextjs";
import { NylasContact } from "../types/contacts.types";
import { NylasThread } from "../types/threads.types";

export function deriveUniqueNonContactsFromThreads(
  initialThreads: NylasThread[],
  contacts: NylasContact[],
  user: User
) {
  // Find participants that don't exist in contacts array
  const participantsNotInContacts = [
    ...new Set(
      initialThreads.flatMap((thread) =>
        thread.participants
          .filter(
            (participant) =>
              participant.email.toLowerCase() !==
                user.user?.primaryEmailAddress?.emailAddress.toLowerCase() &&
              !contacts.some((contact) =>
                contact.emails.some(
                  (emailObj) =>
                    emailObj.email === participant.email.toLowerCase()
                )
              )
          )
          .map((participant) => participant.email)
      )
    ),
  ].map((email) => ({
    email,
    derivedName: initialThreads
      .find((thread) => thread.participants.some((p) => p.email === email))
      ?.participants.find((p) => p.email === email)?.name,
    latestMessage: initialThreads.find((thread) =>
      thread.participants.some((p) => p.email === email)
    )?.latest_draft_or_message,
    nylasContact: {
      emails: [{ email }],
      given_name: "",
      grant_id: "",
      groups: [],
      id: email,
      im_addresses: [],
      object: "contact",
      phone_numbers: [],
      physical_addresses: [],
      picture_url: "",
      surname: "",
      source: "derived",
      web_pages: [],
      updated_at: Date.now(),
      job_title: "",
    },
  }));

  return participantsNotInContacts;
}
