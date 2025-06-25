/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { ForumContact } from "@/app/types/contacts.types";
import { useMessages } from "@/app/hooks/useMessages";
import { NylasThread } from "@/app/types/threads.types";
import { useUser } from "@clerk/nextjs";
import { formatUnixTimestamp } from "@/app/utils/format-unix-timestamp";
import { trimEmailBody } from "@/app/utils/trim-email-body";

type SingleThreadProps = {
  thread: NylasThread;
  selectedContact: ForumContact;
  messageIds: string[];
};

export default function SingleThread({
  thread,
  selectedContact,
  messageIds,
}: SingleThreadProps) {
  const { user } = useUser();

  console.log("Thread: ", thread);

  return (
    <div className="flex gap-4 items-start p-4 hover:bg-[#f3f4f7] rounded-xl">
      <Image
        src={
          thread.participants[0].email === user?.emailAddresses[0].emailAddress
            ? user?.imageUrl
            : selectedContact.nylasContact?.picture_url || "/forum-logo.png"
        }
        alt={
          thread.participants[0].email === user?.emailAddresses[0].emailAddress
            ? "Your profile picture"
            : `${selectedContact.nylasContact?.given_name || selectedContact.derivedName}'s profile picture`
        }
        width={50}
        height={50}
        priority
        className="mx-auto sm:mx-0 rounded-full bg-gray-900"
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          Email
          <div className="text-[#98A2B3] flex items-center gap-2">
            <span className="text-sm">
              {thread.participants[0].email}@
              {thread.participants[0].email.split("@")[1]}
            </span>
            <span className="text-[#667085] text-sm">
              {formatUnixTimestamp(thread.latest_message_received_date, "time")}
            </span>
          </div>
          <div className="text-[#667085] text-xs">{thread.subject}</div>
        </div>
        <div className="text-[#475467]">{trimEmailBody(thread.snippet)}</div>
      </div>
    </div>
  );
}
