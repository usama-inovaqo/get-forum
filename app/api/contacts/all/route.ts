import { NylasContactsResponse } from "@/app/types/contacts.types";
import { getCorsHeaders } from "@/app/utils/cors";
import { currentUser } from "@clerk/nextjs/server";
import { getPrimaryEmailAddress } from "@/app/utils/clerk-user";
import { getBaseUrlForApi } from "@/app/utils/get-base-url";

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

  if (process.env.NEXT_PUBLIC_API_ROUTES_LOGGING === "true") {
    console.log("user: ", user);
    console.log("primaryEmailAddress: ", primaryEmailAddress);
  }

  let contacts: NylasContactsResponse;

  const url = `${getBaseUrlForApi()}/contacts?email=${primaryEmailAddress}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData?.error}`);
    }

    contacts = await response.json();

    if (domain) {
      contacts.data = contacts.data.filter((contact) =>
        contact.emails.some((email) => email.email.includes(domain))
      );
    }
    return new Response(JSON.stringify(contacts), {
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Error fetching contacts: ", error as Error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: getCorsHeaders(request),
    });
  }
}
