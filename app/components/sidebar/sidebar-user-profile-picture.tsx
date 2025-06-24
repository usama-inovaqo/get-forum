import Image from "next/image";
import { User } from "@clerk/nextjs/server";

type SidebarUserProfilePictureProps = {
  user: User;
};

export default function SidebarUserProfilePicture({
  user,
}: SidebarUserProfilePictureProps) {
  return (
    <div className="w-12 h-12 rounded-full">
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={user.firstName || "Your Profile Picture"}
          width={50}
          height={50}
          className="rounded-full"
        />
      ) : (
        <div className="flex items-center justify-center rounded-full bg-gray-400 border-2 border-white w-full h-full">
          <div className="text-md font-semibold text-white">
            {user.firstName?.[0]}
          </div>
        </div>
      )}
    </div>
  );
}
