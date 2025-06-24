// aka conversations, maybe rename to get-all

import { getPrimaryEmailAddress } from "@/app/utils/clerk-user";
import { getCorsHeaders } from "@/app/utils/cors";
import { getBaseUrlForApi } from "@/app/utils/get-base-url";
import { currentUser } from "@clerk/nextjs/server";
import { NylasContact } from "@/app/types/contacts.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const messageIds = searchParams.get("message_ids");

  // Parse message IDs into array
  const messageIdArray = messageIds ? messageIds.split(",") : [];

  const user = await currentUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: getCorsHeaders(request),
    });
  }

  const primaryEmailAddress = getPrimaryEmailAddress(
    user.emailAddresses,
    user.primaryEmailAddressId
  );

  if (!primaryEmailAddress) {
    return new Response(
      JSON.stringify({ error: "Primary email address not found" }),
      {
        headers: getCorsHeaders(request),
      }
    );
  }

  try {
    // Get contacts for the user
    const contactsResponse = await fetch(
      `${getBaseUrlForApi()}/contacts?email=${primaryEmailAddress}`
    );
    const contactsData = await contactsResponse.json();
    const contacts = contactsData.data || [];

    // Fetch each message individually
    const messagePromises = messageIdArray.map(async (messageId) => {
      const response = await fetch(
        `${getBaseUrlForApi()}/messages/${messageId}?email=${primaryEmailAddress}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData?.error}`);
      }

      const messageData = await response.json();
      const message = messageData.data;

      // Get the other participant's email (not the primary user)
      const otherParticipantEmail = [
        message.from[0].email,
        ...(message.to || []).map((p: { email: string }) => p.email),
      ]
        .map((email) => email.toLowerCase())
        .find((email) => email !== primaryEmailAddress.toLowerCase());

      // Check if message is from the user
      const isFromUser =
        message.from[0].email.toLowerCase() ===
        primaryEmailAddress.toLowerCase();

      // Find matching contact
      const matchingContact = contacts.find((contact: NylasContact) =>
        contact.emails?.some((e: { email: string }) => {
          const contactEmail = e.email.toLowerCase();
          return contactEmail === otherParticipantEmail;
        })
      );

      // Get the participant info from the message
      const otherParticipant = isFromUser
        ? message.to?.[0]
        : message.from[0];

      return {
        ...message,
        isFromUser,
        derivedContact: matchingContact
          ? {
              email: matchingContact.emails[0].email,
              derivedName: matchingContact.given_name,
              nylasContact: matchingContact,
            }
          : {
              email: otherParticipantEmail,
              derivedName: otherParticipant?.name || otherParticipantEmail,
              nylasContact: null,
            },
      };
    });

    // Wait for all messages to be fetched
    const messages = await Promise.all(messagePromises);

    return new Response(JSON.stringify({ data: messages }), {
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error(error as Error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: getCorsHeaders(request),
    });
  }
}
