import Image from "next/image";
import { User } from "@clerk/nextjs/server";

type SidebarUserProfilePictureProps = {
  user: User;
};

export default function SidebarUserProfilePicture({
  user,
}: SidebarUserProfilePictureProps) {
  return (
    <div className="size-10 rounded-full ring-1 ring-white">
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={user.firstName || "Your Profile Picture"}
          width={50}
          height={50}
          className="rounded-full"
        />
      ) : (
        <div className="flex size-10 rounded-full ring-1 ring-white">
          <div className="text-md font-semibold text-white">
            {user.firstName?.[0]}
          </div>
        </div>
      )}
    </div>
  );
}
