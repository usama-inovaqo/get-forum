import { NylasContactsResponse } from "@/app/types/contacts.types";
import { getCorsHeaders } from "@/app/utils/cors";
import { currentUser } from "@clerk/nextjs/server";
import { getPrimaryEmailAddress } from "@/app/utils/clerk-user";
import { getBaseUrlForApi } from "@/app/utils/get-base-url";
import { deriveUniqueContactsFromThreads } from "@/app/utils/derive-unique-contacts-from-threads";
import { deriveUniqueNonContactsFromThreads } from "@/app/utils/derive-unique-non-contacts-from-threads";
import { NylasThread } from "@/app/types/threads.types";

export async function GET(request: Request) {
  const user = await currentUser();
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

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

  if (process.env.NEXT_PUBLIC_API_ROUTES_LOGGING === "true") {
    console.log("user: ", user);
    console.log("primaryEmailAddress: ", primaryEmailAddress);
  }

  let contacts: NylasContactsResponse;

  const url = `${getBaseUrlForApi()}/contacts?email=${primaryEmailAddress}&limit=100`;

  try {
    // get threads first to derive contacts
    const threadsResponse = await fetch(
      `${getBaseUrlForApi()}/threads?email=${primaryEmailAddress}&limit=100`
    );
    if (!threadsResponse.ok) {
      const errorData = await threadsResponse.json();
      throw new Error(`${errorData?.error}`);
    }
    const threads = await threadsResponse.json();

    // Filter threads to only include 1-on-1 conversations
    const oneOnOneThreads = threads.data.filter((thread: NylasThread) => {
      const participants = thread.participants.map(
        (p: { name?: string; email: string }) => p.email
      );
      return (
        participants.length === 2 && participants.includes(primaryEmailAddress)
      );
    });

    const contactsResponse = await fetch(url);
    if (!contactsResponse.ok) {
      const errorData = await contactsResponse.json();
      throw new Error(`${errorData?.error}`);
    }
    contacts = await contactsResponse.json();

    if (domain) {
      contacts.data = contacts.data.filter((contact) =>
        contact.emails.some((email) => email.email.includes(domain))
      );
    }

    const derivedContacts = deriveUniqueContactsFromThreads(
      oneOnOneThreads,
      contacts.data
    ).filter(contact => contact.email !== primaryEmailAddress);

    const derivedNonContacts = deriveUniqueNonContactsFromThreads(
      oneOnOneThreads,
      contacts.data,
      {
        username: user.username || undefined,
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
      }
    ).filter(contact => contact.email !== primaryEmailAddress);

    // Get user's email domain to filter team contacts
    const userDomain = primaryEmailAddress.split("@")[1];
    const teamContacts = derivedContacts.filter((contact) =>
      contact.email !== primaryEmailAddress && contact.email.endsWith(`@${userDomain}`)
    );

    return new Response(
      JSON.stringify({
        data: {
          contacts: derivedContacts,
          nonContacts: derivedNonContacts,
          teamContacts: teamContacts,
        },
      }),
      {
        headers: getCorsHeaders(request),
      }
    );
  } catch (error) {
    console.error("Error fetching contacts: ", error as Error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: getCorsHeaders(request),
    });
  }
}
