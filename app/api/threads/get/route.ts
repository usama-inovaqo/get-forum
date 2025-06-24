import { NylasContact } from "@/app/types/contacts.types";
import { NylasThreadsResponse } from "@/app/types/threads.types";
import { getPrimaryEmailAddress } from "@/app/utils/clerk-user";
import { getCorsHeaders } from "@/app/utils/cors";
import { getBaseUrlForApi } from "@/app/utils/get-base-url";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const user = await currentUser();
  const { searchParams } = new URL(request.url);
  const anyEmail = searchParams.get("any_email");
  const limit = searchParams.get("limit");

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: getCorsHeaders(request),
    });
  }

  const primaryEmailAddress =
    getPrimaryEmailAddress(user.emailAddresses, user.primaryEmailAddressId) ||
    "";

  if (process.env.NEXT_PUBLIC_API_ROUTES_LOGGING === "true") {
    console.log("user: ", user);
    console.log("primaryEmailAddress: ", primaryEmailAddress);
  }

  try {
    const baseUrl = `${getBaseUrlForApi()}/threads?email=${primaryEmailAddress}&limit=${limit}`;
    const url = anyEmail ? `${baseUrl}&any_email=${anyEmail}` : baseUrl;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData?.error}`);
    }

    const nylasResponse: NylasThreadsResponse = await response.json();
    const threads = nylasResponse.data;

    // Get contacts for the user
    const contactsResponse = await fetch(
      `${getBaseUrlForApi()}/contacts?email=${primaryEmailAddress}`
    );
    const contactsData = await contactsResponse.json();
    const contacts = contactsData.data || [];

    const threadsWithContacts = threads.map((thread) => {
      // Get all participant emails except the primary user
      const participantEmails = thread.participants
        .map((p) => p.email.toLowerCase())
        .filter((email) => email !== primaryEmailAddress.toLowerCase());

      // Find matching contact
      const matchingContact = contacts.find((contact: NylasContact) =>
        contact.emails?.some((e: { email: string }) => {
          const contactEmail = e.email.toLowerCase();
          return (
            participantEmails.includes(contactEmail) &&
            contactEmail !== primaryEmailAddress.toLowerCase()
          );
        })
      );

      return {
        ...thread,
        derivedContact: matchingContact
          ? {
              email: matchingContact.emails[0].email,
              derivedName: matchingContact.given_name,
              nylasContact: matchingContact,
            }
          : null,
      };
    });

    if (anyEmail) {
      const filteredThreads = threadsWithContacts.filter((thread) => {
        // Filter out trash folders
        const notInTrash = thread.folders?.some(
          (folder) => !folder.includes("TRASH")
        );

        // Check if it's a 1-on-1 conversation with the specified email
        const participants = thread.participants.map((p) =>
          p.email.toLowerCase()
        );
        const isOneOnOne =
          participants.length === 2 &&
          participants.includes(primaryEmailAddress.toLowerCase()) &&
          participants.includes(anyEmail.toLowerCase());

        return notInTrash && isOneOnOne;
      });

      return new Response(JSON.stringify({ data: filteredThreads }), {
        headers: getCorsHeaders(request),
      });
    }

    return new Response(JSON.stringify({ data: threadsWithContacts }), {
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error(error as Error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: getCorsHeaders(request),
    });
  }
}
