import { SignOutButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import SidebarUserProfilePicture from "./sidebar-user-profile-picture";
import Dropdown from "../dropdown/dropdown";
import DropdownMenuItem from "../dropdown/dropdown-menu-item";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

type SidebarUserProfileProps = {
  user: User;
};

export default function SidebarUserProfile({ user }: SidebarUserProfileProps) {
  return (
    <div className="col-span-2 flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between gap-4 w-full">
        <div>
          <SidebarUserProfilePicture user={user} />
        </div>
        <div className="flex flex-col w-full">
          <div className="font-medium text-lg">{user.firstName}</div>
          <span className="text-sm">{user.emailAddresses[0].emailAddress}</span>
        </div>
        <div className="text-sm text-[#98A2B3]">
          <Dropdown
            button={<EllipsisHorizontalIcon className={`w-6 h-6 text-black`} />}
            anchor="left"
            items={[
              <DropdownMenuItem key="starred" onClick={() => {}}>
                <SignOutButton>
                  <span>Sign Out</span>
                </SignOutButton>
              </DropdownMenuItem>,
            ]}
            menuItemsClassName="sm:w-auto sm:mt-auto sm:ml-32"
          />
        </div>
      </div>
    </div>
  );
}
