import { ForumContact } from "../types/contacts.types";
import { NylasMessage } from "../types/messages.types";
import { NylasThread } from "../types/threads.types";

export type Conversation = {
  selectedContacts: ForumContact[] | []; //  the person or group of people we're talking to, maybe rename to participants
  threads?: NylasThread[];
  latestMessage?: NylasMessage | null;
};
