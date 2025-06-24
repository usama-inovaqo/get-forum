// this file is just for sorting and filtering contacts
import { ForumContact, SidebarContactBox } from "@/app/types/contacts.types";
import { useState, useMemo, useCallback } from "react";
import SidebarContactsBox from "./sidebar-contacts-box";
import SidebarContactGroupGroupBox from "./groups/sidebar-contact-group-group-box";

type SidebarContactsBoxContainerProps = {
  box: SidebarContactBox;
  selectedContacts: ForumContact[] | null;
  onSelectContacts: (contact: ForumContact[]) => void;
};

export default function SidebarContactsBoxContainer({
  box,
  selectedContacts,
  onSelectContacts,
}: SidebarContactsBoxContainerProps) {
  const [currentSortType, setCurrentSortType] = useState("newest");

  const sortContacts = useCallback(
    (sortType: string) => {
      const contactsCopy = [...box.contacts];

      switch (sortType) {
        case "asc":
          return contactsCopy.sort((a, b) =>
            (a.nylasContact?.given_name || a.derivedName || "").localeCompare(
              b.nylasContact?.given_name || b.derivedName || ""
            )
          );
        case "desc":
          return contactsCopy.sort((a, b) =>
            (b.nylasContact?.given_name || b.derivedName || "").localeCompare(
              a.nylasContact?.given_name || a.derivedName || ""
            )
          );
        case "newest":
          return contactsCopy.sort((a, b) => {
            const dateA = new Date(a.latestMessage?.date || 0);
            const dateB = new Date(b.latestMessage?.date || 0);
            return dateB.getTime() - dateA.getTime();
          });
        case "starred":
          return contactsCopy.sort((a, b) => {
            if (a.latestMessage?.starred === b.latestMessage?.starred) return 0;
            return a.latestMessage?.starred ? -1 : 1;
          });
        default:
          return contactsCopy;
      }
    },
    [box.contacts]
  );

  const sortedContacts: ForumContact[] = useMemo(
    () => sortContacts(currentSortType),
    [currentSortType, sortContacts]
  );

  return (
    <div>
      {box.group && box.contacts && (
        <SidebarContactGroupGroupBox
          groupName="Forum Group"
          contacts={box.contacts}
          selectedContacts={selectedContacts}
          onSelectContacts={onSelectContacts}
        />
      )}
      {!box.group && (
        <SidebarContactsBox
          box={box}
          contacts={sortedContacts}
          selectedContacts={selectedContacts}
          onSelectContacts={onSelectContacts}
          onSortContacts={setCurrentSortType}
        />
      )}
    </div>
  );
}
