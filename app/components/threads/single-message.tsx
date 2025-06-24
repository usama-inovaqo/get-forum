"use client";
import { formatUnixTimestamp } from "@/app/utils/format-unix-timestamp";
import {
  NylasMessage,
  NylasMessageWithContact,
} from "@/app/types/messages.types";
import { trimEmailHtml } from "@/app/utils/trim-email-html";
import { getEmailDomain } from "@/app/utils/get-email-domain";
import SingleMessageProfilePicture from "./single-message-profile-picture";
import { User } from "@clerk/nextjs/server";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type SingleMessageProps = {
  user: User;
  message: NylasMessageWithContact;
  onRespondToMessage: (message: NylasMessage) => void;
};

export default function SingleMessage({
  user,
  message,
  onRespondToMessage,
}: SingleMessageProps) {
  return (
    <div>
      {message.unread && (
        <div className="flex items-center gap-4 h-2 text-[#B80045] text-sm">
          <span className="w-full border-t border-[#B80045]"></span>New{" "}
          <span className="w-full border-t border-[#B80045]"></span>
        </div>
      )}
      <div className="flex gap-4 items-start p-4 hover:bg-[#f3f4f7] rounded-xl w-full group">
        <SingleMessageProfilePicture user={user} message={message} />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {message.isFromUser
              ? user.firstName
              : message.derivedContact.nylasContact?.given_name ||
                message.derivedContact.derivedName}
            <div className="text-[#98A2B3] flex items-center gap-2">
              <span className="text-sm">
                {message.isFromUser
                  ? `@${getEmailDomain(user.emailAddresses[0].emailAddress)}`
                  : `@${getEmailDomain(message.derivedContact.email)}`}
              </span>
              <span className="text-[#667085] text-sm">
                {formatUnixTimestamp(message.date, "mmdd")}
              </span>
            </div>
            <div className="text-[#667085] text-xs">{message.subject}</div>
            <div
              className={`invisible ${
                !message.isFromUser && "group-hover:visible"
              } flex items-center`}
            >
              <button
                onClick={() => onRespondToMessage(message)}
                disabled={message.isFromUser}
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* <div className="text-[#475467]">{trimEmailBody(message.body)}</div> */}
          <div
            dangerouslySetInnerHTML={{ __html: trimEmailHtml(message.body) }}
          />
        </div>
      </div>
    </div>
  );
}
