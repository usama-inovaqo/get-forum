import { ForumContactsResponse } from "../types/contacts.types";
import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import ErrorState from "../layouts/error-layout";
import ConversationContainer from "./conversation-container";
import { mockContactsResponse } from "../data/mock-data";

export default async function Conversations() {
  return (
    <SignedIn>
      <AuthenticatedContent />
    </SignedIn>
  );
}

async function AuthenticatedContent() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const contacts: ForumContactsResponse = mockContactsResponse;

    const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;

    return (
      <div className="h-full overflow-hidden">
        <ConversationContainer initialContacts={contacts} user={serializedUser} />
      </div>
    );
  } catch (error) {
    console.error("error: ", error);
    return <ErrorState message={(error as Error).message} />;
  }
}
