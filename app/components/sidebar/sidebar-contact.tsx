import { ForumContact } from "@/app/types/contacts.types";
import { formatUnixTimestamp } from "@/app/utils/format-unix-timestamp";
import { trimEmailBody } from "@/app/utils/trim-email-body";
import { truncateString } from "@/app/utils/truncate-string";
import { StarIcon } from "@heroicons/react/24/solid";
import { getEmailDomain } from "@/app/utils/get-email-domain";
import SidebarContactProfilePicture from "./sidebar-contact-profile-picture";
import { contactNameFallback } from "@/app/utils/contact-name-fallback";

type SidebarContactProps = {
  contact: ForumContact;
  onSelectContact: (contact: ForumContact) => void;
  selectedContact: ForumContact | null;
};

export default function SidebarContact({
  contact,
  onSelectContact,
  selectedContact,
}: SidebarContactProps) {
  const timeReceived = formatUnixTimestamp(contact.latestMessage?.date, "time");

  return (
    <button
      className={`w-full flex items-center justify-between rounded-xl py-4 hover:bg-gray-50 ${selectedContact?.nylasContact?.id === contact.nylasContact?.id
        ? "bg-[#F9FAFB]"
        : ""
        }`}
      onClick={() => onSelectContact(contact)}
    >
      {/* profile picture */}
      <div className="size-10 rounded-full">
        <SidebarContactProfilePicture contact={contact} />
      </div>

      {/* contact info */}
      <div className="flex flex-col items-start overflow-hidden">
        <div className="flex items-center gap-1">
          <div className="w-full truncate">
            {contactNameFallback(contact)}
          </div>
          <div className="text-[#98A2B3] text-sm shrink-0">
            @{getEmailDomain(contact.email)}
          </div>
        </div>
        <div
          className={`text-[#667085] text-sm text-left flex items-center gap-1 ${contact.latestMessage?.from[0].email !== contact.email
            ? "italic"
            : ""
            }`}
        >
          {contact.latestMessage?.starred ? (
            <StarIcon className="w-4 h-4 text-yellow-500" />
          ) : null}
          {truncateString(
            trimEmailBody(contact.latestMessage?.snippet || ""),
            24
          )}
        </div>
      </div>

      {/* time */}
      <div className="text-[#667085] hidden text-xs sm:text-sm sm:flex sm:flex-col">
        {timeReceived}
      </div>
    </button>
  );
}
