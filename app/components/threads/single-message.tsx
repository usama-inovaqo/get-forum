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
import { PencilSquareIcon, ChevronDownIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

type SingleMessageProps = {
  user: User;
  message: NylasMessageWithContact;
  onRespondToMessage: (message: NylasMessage) => void;
  onReplyToMessage: (message: NylasMessage) => void;
  isFirstMessage?: boolean;
  isFirstMessageOfToday?: boolean;
  showNewSeparator?: boolean;
  replyToMessage?: NylasMessageWithContact; // The original message this is replying to
  applyTopMargin?: boolean;
};

export default function SingleMessage({
  user,
  message,
  onRespondToMessage,
  onReplyToMessage,
  isFirstMessage = false,
  isFirstMessageOfToday = false,
  showNewSeparator = false,
  replyToMessage,
  applyTopMargin = false,
}: SingleMessageProps) {
  return (
    <div>
      {isFirstMessage && (
        <div className={`flex items-center h-6 text-[#667085] text-sm mb-4 mx-4 ${applyTopMargin ? 'mt-12' : ''}`}>
          <span className="w-full border-t border-[#E4E7EC]"></span>
          <div className="ml-2 px-2 bg-white whitespace-nowrap text-xs font-medium">
            Chat Beginning
          </div>
          <span className="w-full border-t border-[#E4E7EC]"></span>
        </div>
      )}
      {isFirstMessageOfToday && (
        <div className="flex items-center h-6 text-[#667085] text-sm mb-4 mx-4">
          <span className="w-full border-t border-[#E4E7EC]"></span>
          <div className="flex items-center justify-center w-5 h-5 bg-[#EAECF0] rounded-full -ml-2.5 flex-shrink-0">
            <ChevronDownIcon className="w-2.5 h-2.5 text-[#101828]" />
          </div>
          <div className="ml-2 px-2 bg-white whitespace-nowrap text-xs font-medium">
            Today
          </div>
          <span className="w-full border-t border-[#E4E7EC]"></span>
        </div>
      )}
      {showNewSeparator && (
        <div className="flex items-center gap-4 h-2 text-[#B80045] text-sm mb-4 mx-4">
          <span className="w-full border-t border-[#B80045]"></span>
          <div className="ml-2 px-2 bg-white whitespace-nowrap text-xs font-medium text-[#B80045]">
            New
          </div>
          <span className="w-full border-t border-[#B80045]"></span>
        </div>
      )}

      <div className="flex gap-4 items-start p-4 hover:bg-[#f3f4f7] rounded-xl w-full group">
        <SingleMessageProfilePicture user={user} message={message} />
        <div className="flex flex-col gap-2 flex-1">
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
                {formatUnixTimestamp(message.date, "time")}
              </span>
            </div>
            {}
            <div className="text-[#667085] text-xs">{ !message.isFromUser && "Subject : "}{!message.isFromUser && message.subject}</div>
            <div
              className={`invisible ${
                !message.isFromUser && "group-hover:visible"
              } flex items-center gap-1`}
            >
              <button
                onClick={() => onReplyToMessage(message)}
                disabled={message.isFromUser}
                className="p-1 hover:bg-[#E4E7EC] rounded disabled:opacity-50"
                title="Reply to this message"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRespondToMessage(message)}
                disabled={message.isFromUser}
                className="p-1 hover:bg-[#E4E7EC] rounded disabled:opacity-50"
                title="Respond to this message"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Show quoted message if this is a reply */}
          {replyToMessage && (
            <div className="bg-[#F8F9FA] border-l-4 border-[#E4E7EC] rounded-r-lg p-3 mb-2">
              <div className="text-xs text-[#667085] mb-2">
                Subject: {replyToMessage.subject} • {new Date(replyToMessage.date * 1000).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })} • {formatUnixTimestamp(replyToMessage.date, "time")}
              </div>
              <div className="text-sm text-[#475467]">
                {replyToMessage.snippet || replyToMessage.body.replace(/<[^>]*>/g, '').substring(0, 200)}
              </div>
            </div>
          )}

          {/* Message content */}
          <div
            dangerouslySetInnerHTML={{ __html: trimEmailHtml(message.body) }}
          />
        </div>
      </div>
    </div>
  );
}
