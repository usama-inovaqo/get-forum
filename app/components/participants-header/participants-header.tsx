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
      <div className="flex items-center gap-2">
        <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{color: '#101828'}}
            title="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
            <path
                d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
          </svg>
        </button>

        <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{color: '#101828'}}
            title="Calendar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>

        <button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: '#101828' }}
          title="Favorite"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </button>
        
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: '#101828' }}
          title="More options"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
