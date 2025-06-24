import { ForumContact } from "./contacts.types";

export interface NylasEmailAddress {
  email: string;
}

export interface NylasMessage {
  starred: boolean;
  unread: boolean;
  folders: string[];
  subject: string;
  thread_id: string;
  body: string;
  grant_id: string;
  id: string;
  object: "message";
  snippet: string;
  bcc: NylasEmailAddress[];
  cc: NylasEmailAddress[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments: any[];
  from: NylasEmailAddress[];
  reply_to: NylasEmailAddress[];
  to: NylasEmailAddress[];
  date: number; // Unix timestamp
}

export type NylasMessagesResponse = {
  request_id: string;
  data: NylasMessage[];
};

export type NylasMessageWithContact = NylasMessage & {
  derivedContact: ForumContact;
  isFromUser: boolean;
};
