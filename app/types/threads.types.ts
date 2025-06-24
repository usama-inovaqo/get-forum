import { NylasContact } from "./contacts.types";

// TODO this is sample data, replace with actual shape
export type ForumThread = {
  id: string;
  to: string;
  from: string;
  subject: string;
  derivedContact: {
    name: string;
    email: string;
    nylasContact: NylasContact;
  };
  lastMessageTimestamp: string;
};

export type NylasThreadLatestDraftOrMessage = {
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
  bcc: { name?: string; email: string }[];
  cc: { name?: string; email: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments: any[]; // Can be further typed if attachment structure is known
  from: { name?: string; email: string }[];
  reply_to: { name?: string; email: string }[];
  to: { name?: string; email: string }[];
  date: number;
};

export type NylasThread = {
  starred: boolean;
  unread: boolean;
  folders: string[];
  latest_draft_or_message: NylasThreadLatestDraftOrMessage;
  has_attachments: boolean;
  has_drafts: boolean;
  grant_id: string;
  id: string;
  object: "thread";
  snippet: string;
  subject: string;
  participants: { name?: string; email: string }[];
  message_ids: string[];
  draft_ids: string[];
  earliest_message_date: number;
  latest_message_received_date?: number;
  latest_message_sent_date?: number;
};

export type NylasThreadsResponse = {
  request_id: string;
  data: NylasThread[];
  next_cursor: string;
};

export type ForumThreadWithContact = NylasThread & {
  derivedContact: {
    name: string;
    email: string;
    nylasContact: NylasContact;
  };
};
