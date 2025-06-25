"use client";
import Image from "next/image";
import { NylasMessageWithContact } from "@/app/types/messages.types";
import { contactNameFallback } from "@/app/utils/contact-name-fallback";
import { User } from "@clerk/nextjs/server";

type SingleMessageProfilePictureProps = {
  user: User;
  message: NylasMessageWithContact;
};

export default function SingleMessageProfilePicture({
  user,
  message,
}: SingleMessageProfilePictureProps) {
  // For user messages, always use user's image if available
  const shouldUseUserImage = message.isFromUser && user?.imageUrl;
  
  // For other messages, use contact's picture if available
  const contactHasPicture = !message.isFromUser && message.derivedContact.nylasContact?.picture_url;

  return (
    <div className="flex-shrink-0">
      {(shouldUseUserImage || contactHasPicture) ? (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-900">
          <Image
            src={
              message.isFromUser
                ? user?.imageUrl
                : message.derivedContact.nylasContact?.picture_url || ""
            }
            alt={
              message.isFromUser
                ? "Your profile picture"
                : `${message.derivedContact.nylasContact?.given_name || message.derivedContact.derivedName}'s profile picture`
            }
            width={48}
            height={48}
            priority
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-gray-400 w-12 h-12 rounded-full flex-shrink-0 border-2 border-white">
          <div className="text-md font-semibold text-white">
            {message.isFromUser 
              ? (user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || "U") 
              : contactNameFallback(message.derivedContact)[0]
            }
          </div>
        </div>
      )}
    </div>
  );
}
