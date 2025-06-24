import { ForumContact } from "@/app/types/contacts.types";
import SidebarContactProfilePicture from "../sidebar-contact-profile-picture";

type SidebarContactGroupGroupBoxProps = {
  groupName: string;
  contacts: ForumContact[];
  selectedContacts: ForumContact[] | null;
  onSelectContacts: (contacts: ForumContact[]) => void;
};

export default function SidebarContactGroupGroupBox({
  groupName,
  contacts,
  selectedContacts,
  onSelectContacts,
}: SidebarContactGroupGroupBoxProps) {
  return (
    <div className="flex flex-col rounded-xl gap-4 p-2 text-black bg-[#F9FAFB]">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2 shrink-0">
          <div className="group flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="flex items-center gap-1">
              <div className="text-xl font-semibold text-gray-600">
                {groupName}
              </div>
              <div className="flex items-center gap-1 text-sm text-[#98A2B3] font-medium">
                <div>({contacts.length})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-h-[1000px] overflow-y-auto transition-all duration-300 flex flex-col gap-2">
        <button
          onClick={() => onSelectContacts(contacts)}
          className={`flex flex-wrap hover:bg-[#F9FAFB] rounded-xl p-2 ${
            selectedContacts && selectedContacts.length === contacts.length
              ? "bg-[#F9FAFB]"
              : ""
          }`}
          title={contacts.map((contact) => contact.derivedName).join(", ")}
        >
          <div className="flex -space-x-7 overflow-hidden">
            {contacts.map((contact) => (
              <div key={contact.email}>
                <SidebarContactProfilePicture contact={contact} />
              </div>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}

/*

TODO move this up here:
<div
          className={`text-[#667085] text-sm text-left flex items-center gap-1 ${
            contact.latestMessage?.from[0].email !== contact.email
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
      <div className="col-span-2 text-[#667085] hidden text-xs sm:text-sm sm:flex sm:flex-col">
       {  formatUnixTimestamp(contact.latestMessage?.date, "time");}
      </div>
      </div>
*/
