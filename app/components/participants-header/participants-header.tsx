import Image from "next/image";
import { ForumContact } from "@/app/types/contacts.types";
import { contactNameFallback } from "@/app/utils/contact-name-fallback";
import { getEmailDomain } from "@/app/utils/get-email-domain";

type ParticipantsHeaderProps = {
  participants: ForumContact[];
};

export default function ParticipantsHeader({
  participants,
}: ParticipantsHeaderProps) {
  return (
    <div className="col-span-2 p-2 sm:p-4 flex gap-4 justify-between">
      {participants.map((contact) => (
        <div key={contact.email} className="flex gap-4 justify-between">
          <div className="flex gap-4 items-center">
            {contact.nylasContact?.picture_url ? (
              <Image
                src={contact.nylasContact.picture_url}
                alt={`${contactNameFallback(contact)}'s picture`}
                width={75}
                height={75}
                priority
                className="mx-auto sm:mx-0 rounded-full bg-gray-900"
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-400 w-16 h-16 rounded-full border-2 border-white">
                <div className="text-lg font-semibold text-white uppercase">
                  {contactNameFallback(contact)[0]}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {contactNameFallback(contact)}
                <div className="text-[#98A2B3]">
                  @{getEmailDomain(contact.email)}
                </div>
              </div>
              <div className="text-[#475467]">
                {contact.nylasContact?.job_title || <div>&nbsp;</div>}
              </div>
            </div>
          </div>
          <div>&nbsp;</div>
        </div>
      ))}

      <div>&nbsp;</div>
    </div>
  );
}
