// TODO move/renamethis to emails/post?
import {
  ComposedMessage,
  ComposedMessagePayload,
} from "@/app/components/composer/composer.types";
import { getPrimaryEmailAddress } from "@/app/utils/clerk-user";
import { getCorsHeaders } from "@/app/utils/cors";
import { getBaseUrlForApi } from "@/app/utils/get-base-url";
import { isValidEmail } from "@/app/utils/is-valid-email";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
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
    const body: ComposedMessage = await request.json();

    const toEmails = body.recipients.to
      .trim()
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
    const ccEmails = body.recipients.cc
      .trim()
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
    const bccEmails = body.recipients.bcc
      .trim()
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);

    const allEmails = [...toEmails, ...ccEmails, ...bccEmails];
    const invalidEmails = allEmails.filter((email) => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      throw new Error(
        `Invalid email address${
          invalidEmails.length > 1 ? "es" : ""
        }: "${invalidEmails.join(", ")}"`
      );
    }

    const payload: ComposedMessagePayload = {
      email: primaryEmailAddress,
      to: body.recipients.to.trim(),
      cc: body.recipients.cc.trim(),
      bcc: body.recipients.bcc.trim(),
      subject: body.subject,
      body: body.body,
      reply_to_message_id: body.replyToMessageId || "",
    };

    const url = `${getBaseUrlForApi()}/send-email?email=${primaryEmailAddress}`;

    console.log("url", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to send email");
    }

    const result = await response.json();
    return new Response(JSON.stringify({ data: result }), {
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error(error as Error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: getCorsHeaders(request),
    });
  }
}
