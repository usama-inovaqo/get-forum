import { NylasThreadLatestDraftOrMessage } from "./threads.types";

export type ForumContact = {
  email: string;
  derivedName: string | undefined;
  latestMessage?: NylasThreadLatestDraftOrMessage;
  nylasContact: NylasContact;
};

export type ForumContactsResponse = {
  contacts: ForumContact[];
  teamContacts: ForumContact[];
  nonContacts: ForumContact[];
};

export type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  title: string;
  lastSubjectLine: string; // TODO this will almost certainly be changed
};

export type SidebarContactBox = {
  title: string;
  startOpen: boolean;
  contacts: ForumContact[];
  group?: boolean;
  domain?: string;
};

export type NylasContact = {
  emails: { email: string }[];
  given_name: string;
  grant_id: string;
  groups: { id: string }[];
  id: string;
  im_addresses: string[];
  object: string;
  phone_numbers: string[];
  physical_addresses: string[];
  picture_url: string;
  surname: string;
  source: string;
  web_pages: string[];
  updated_at: number;
  job_title: string;
  lastMessage?: {
    message: NylasThreadLatestDraftOrMessage;
    latest_message_received_date: number;
    latest_message_sent_date: number;
  };
};

// one contact?
export type NylasContactsResponse = {
  request_id: string;
  data: NylasContact[];
};
