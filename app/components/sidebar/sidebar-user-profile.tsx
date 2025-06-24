import { SignOutButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import SidebarUserProfilePicture from "./sidebar-user-profile-picture";
import Dropdown from "../dropdown/dropdown";
import DropdownMenuItem from "../dropdown/dropdown-menu-item";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

type SidebarUserProfileProps = {
  user: User;
};

export default function SidebarUserProfile({ user }: SidebarUserProfileProps) {
  return (
    <div className="col-span-2 flex flex-col gap-2 p-2">
      <div className="flex flex-row items-center justify-between gap-4 w-full">
        {/* Avatar */}
        <div>
          <SidebarUserProfilePicture user={user} />
        </div>

        {/* name and email */}
        <div className="flex flex-col w-full">
          <div className="font-medium text-lg">{user.firstName}</div>
          <div className="flex items-center gap-1">
            <div className="text-[#98A2B3]">Online</div>
            <div>
              <ChevronDownIcon className="w-4 h-4 text-gray-900" />
            </div>
          </div>
          {/* <span className="text-sm">{user.emailAddresses[0].emailAddress}</span> */}
        </div>

        {/* icons */}
        <div className="flex text-sm gap-2 text-[#98A2B3]">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-6 h-6 text-gray-900 rotate-45"
            >
              <path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
              <path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z" />
              <path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z" />
              <path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
            </svg>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-6 h-6 text-gray-900"
            >
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </svg>
          </div>
          <Dropdown
            button={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-6 h-6 text-gray-900"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            }
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
