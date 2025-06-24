import { EmailAddress } from "@clerk/nextjs/server";

export function getPrimaryEmailAddress(
  emailAddresses: EmailAddress[] | undefined,
  primaryEmailAddressId: string | null
): string | undefined {
  const primaryEmail = emailAddresses?.find(
    (email: EmailAddress) => email.id === primaryEmailAddressId
  );
  return primaryEmail?.emailAddress;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUserEmail(user: any): string | undefined {
  return user?.user?.primaryEmailAddress?.emailAddress;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserEmailDomain(user: any): Promise<string> {
  const email = user?.user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    return "";
  }
  return `@${email.split("@")[1]}`;
}
