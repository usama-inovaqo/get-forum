import Image from "next/image";
import { ForumContact } from "@/app/types/contacts.types";

type SidebarContactProfilePictureProps = {
  contact: ForumContact;
};

export default function SidebarContactProfilePicture({
  contact,
}: SidebarContactProfilePictureProps) {
  return (
    <div>
      {contact.nylasContact?.picture_url ? (
        <Image
          src={contact.nylasContact?.picture_url}
          alt={contact.nylasContact?.given_name || "Contact's Picture"}
          width={50}
          height={50}
          className="inline-block size-10 rounded-full ring-1 ring-white"
        />
      ) : (
        <div className="inline-block size-10 rounded-full ring-1 ring-white">
          {contact.derivedName?.[0]}
        </div>
      )}
    </div>
  );
}
