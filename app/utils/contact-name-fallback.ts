import { ForumContact } from "../types/contacts.types";

export function contactNameFallback(contact: ForumContact) {
    return contact.nylasContact?.given_name || contact.derivedName || contact.email;
}