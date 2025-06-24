import { useEffect, useState } from "react";
import { Input } from "@headlessui/react";
import { ForumContact, SidebarContactBox } from "@/app/types/contacts.types";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Dropdown from "@components/dropdown/dropdown";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import DropdownMenuItem from "../dropdown/dropdown-menu-item";
import SidebarContact from "./sidebar-contact";

type SidebarContactsBox = {
  box: SidebarContactBox;
  contacts: ForumContact[];
  selectedContacts: ForumContact[] | null;
  onSelectContacts: (contact: ForumContact[]) => void;
  onSortContacts: (sortType: string) => void;
};

export default function SidebarContactsBox({
  box,
  contacts,
  selectedContacts,
  onSelectContacts,
  onSortContacts,
}: SidebarContactsBox) {
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState(""); // sort contacts above, filter sorted contacts at this level

  const filteredContacts = contacts.filter((contact) => {
    return (
      contact.nylasContact?.given_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      contact.derivedName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const [contactBoxOpen, setContactBoxOpen] = useState(
    box.startOpen && filteredContacts.length > 0
  );

  const displayedContacts = contactBoxOpen
    ? showAllContacts
      ? filteredContacts
      : filteredContacts.slice(0, 3)
    : [];

  useEffect(() => {
    if (filteredContacts.length === 0 && contactBoxOpen) {
      console.log("setting contactBoxOpen to false");
      setContactBoxOpen(false);
    } else if (
      filteredContacts.length > 0 &&
      !contactBoxOpen &&
      search &&
      searchOpen
    ) {
      console.log("setting contactBoxOpen to true");
      setContactBoxOpen(true);
    }
  }, [filteredContacts.length, search, searchOpen, contactBoxOpen]);

  return (
    <div className="flex flex-col rounded-xl gap-4 p-2 text-black bg-[#F2F4F7]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 shrink-0">
          <button
            title={contactBoxOpen ? "Collapse contacts" : "Expand contacts"}
            onClick={() => {
              setContactBoxOpen(!contactBoxOpen);
              if (!contactBoxOpen === false) {
                setShowAllContacts(false);
              }
            }}
            disabled={contacts.length < 3}
            className="group flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDownIcon
              className={`rounded-lg p-1 group-hover:bg-[#F9FAFB] w-7 h-7 text-gray-600 ${
                contactBoxOpen ? "" : "-rotate-90"
              }`}
            />

            <div className="flex items-center gap-1">
              <div className="text-xl font-semibold text-gray-600">
                {box.title}
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <div className="text-gray-600">{box.domain && box.domain}</div>
                <div className="text-[#98A2B3]">{contacts.length}</div>
              </div>
            </div>
          </button>
        </div>

        <div className="text-sm text-[#98A2B3]">
          <Dropdown
            button={
              <AdjustmentsHorizontalIcon
                className={`w-5 h-5 ${search ? "text-[#475467]" : ""}`}
              />
            }
            items={[
              <DropdownMenuItem
                key="newest"
                onClick={() => onSortContacts("newest")}
              >
                Sort by newest
              </DropdownMenuItem>,
              <DropdownMenuItem key="asc" onClick={() => onSortContacts("asc")}>
                Sort A-Z
              </DropdownMenuItem>,
              <DropdownMenuItem
                key="desc"
                onClick={() => onSortContacts("desc")}
              >
                Sort Z-A
              </DropdownMenuItem>,
              <DropdownMenuItem
                key="starred"
                onClick={() => onSortContacts("starred")}
              >
                Starred
              </DropdownMenuItem>,
              <DropdownMenuItem
                key="search"
                onClick={(e) => {
                  e?.preventDefault();
                  setSearchOpen(true);
                }}
              >
                <span className="flex items-center gap-2 border-t pt-2 w-full">
                  {searchOpen ? (
                    <div className="flex items-center gap-2 w-full">
                      <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />
                      <Input
                        name="search"
                        type="text"
                        className="border border-gray-300 rounded-xl p-2 w-full"
                        autoFocus={searchOpen}
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />{" "}
                      Search
                    </div>
                  )}
                </span>
              </DropdownMenuItem>,
            ]}
          />
        </div>
      </div>
      <div
        className={`${
          contactBoxOpen ? "block max-h-[1000px]" : "hidden max-h-0"
        } overflow-y-auto transition-all duration-300`}
      >
        {displayedContacts.map((contact) => (
          <SidebarContact
            key={contact.email}
            contact={contact}
            onSelectContact={(contact) => onSelectContacts([contact])}
            selectedContact={selectedContacts && selectedContacts[0]}
          />
        ))}

        <div className="flex items-center justify-center text-sm text-gray-600 font-semibold">
          {contactBoxOpen &&
            filteredContacts.length > 3 &&
            (showAllContacts ? (
              <button
                onClick={() => setShowAllContacts(false)}
                className="py-2 px-4 rounded-xl hover:bg-[#F9FAFB]"
              >
                Show less
              </button>
            ) : (
              <button
                onClick={() => setShowAllContacts(true)}
                className="py-2 px-4 rounded-xl hover:bg-[#F9FAFB]"
              >
                Show more ({filteredContacts.length - 3} more)
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
