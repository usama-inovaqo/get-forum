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
  return (
    <div className="flex-shrink-0">
      {message.derivedContact.nylasContact?.picture_url ? (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-900">
          <Image
            src={
              message.isFromUser
                ? user?.imageUrl
                : message.derivedContact.nylasContact.picture_url
            }
            alt={
              message.isFromUser
                ? "Your profile picture"
                : `${message.derivedContact.nylasContact.given_name}'s profile picture`
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
            {contactNameFallback(message.derivedContact)[0]}
          </div>
        </div>
      )}
    </div>
  );
}
