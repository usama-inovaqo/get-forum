export type ComposerVariant = "mini" | "full";

export type ComposedMessageRecipients = {
  to: string;
  cc: string;
  bcc: string;
};

export type ComposedMessage = {
  recipients: ComposedMessageRecipients;
  subject: string;
  body: string;
  replyToMessageId?: string;
};

export type ComposedMessagePayload = {
  email: string; // primary email address of the user
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  reply_to_message_id?: string;
};
