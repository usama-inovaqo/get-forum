import {
  ForumContact,
  ForumContactsResponse,
  NylasContact,
} from "@/app/types/contacts.types";
import { splitCommaSeparatedString } from "@/app/utils/split-comma-separated-strings";

export function generateUUID(): string {
  // Check if crypto.randomUUID is available
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const createEphemeralContactFromEmailString = (
  email: string
): NylasContact => ({
  emails: [{ email }],
  object: "contact",
  given_name: "",
  grant_id: "",
  groups: [],
  id: generateUUID(),
  im_addresses: [],
  phone_numbers: [],
  physical_addresses: [],
  picture_url: "",
  surname: "",
  source: "manual",
  web_pages: [],
  updated_at: Date.now(),
  job_title: "",
});

export const combineRealAndEphemeralContacts = (
  contacts: ForumContactsResponse,
  commaSeparatedString: string
): NylasContact[] => {
  const emailList = splitCommaSeparatedString(commaSeparatedString);
  const newEmails = emailList.filter(
    (email) =>
      !contacts.contacts.some((contact: ForumContact) =>
        contact.nylasContact.emails.some(
          (e: { email: string }) =>
            e.email.toLowerCase() === email.toLowerCase()
        )
      )
  );

  return [
    ...contacts.contacts.map((contact) => contact.nylasContact),
    ...newEmails.map(createEphemeralContactFromEmailString),
  ];
};
