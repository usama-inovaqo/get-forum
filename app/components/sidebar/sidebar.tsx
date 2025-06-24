import Link from "next/link";
import {
  ForumContact,
  ForumContactsResponse,
  SidebarContactBox,
} from "@/app/types/contacts.types";
import ForumLogo from "../logo/forum-logo";
import { User } from "@clerk/nextjs/server";
import SidebarUserProfile from "./sidebar-user-profile";
import SidebarContactsBoxContainer from "./sidebar-contacts-box-container";
import { useEffect } from "react";

const hardCodedGroupContacts: ForumContact[] = [
  {
    email: "lkaileh@gmail.com",
    derivedName: "Liam Kaileh",
    latestMessage: undefined,
    nylasContact: {
      emails: [
        {
          email: "lkaileh@gmail.com",
        },
      ],
      given_name: "Lou",
      grant_id: "49f23a2e-c7ac-4d7a-a712-d742ec473302",
      groups: [
        {
          id: "907688c8a2ca872",
        },
      ],
      id: "c4085850589099461431",
      im_addresses: [],
      object: "contact",
      phone_numbers: [],
      physical_addresses: [],
      picture_url:
        "https://lh3.googleusercontent.com/cm/AGPWSu9JjyYNwnAEXO8kLLsmncS7gfnwyJ_UPH1548EpB81UHdzz6ua-Oamw9gJalkV8YIqmIw=s100",
      surname: "Kaileh",
      source: "address_book",
      web_pages: [],
      updated_at: 1733153087,
    },
  },
  {
    email: "dstromberg87@gmail.com",
    derivedName: "Drew",
    latestMessage: undefined,
    nylasContact: {
      birthday: "1987-12-23",
      company_name: "SSDP",
      emails: [
        {
          email: "dstromberg87@gmail.com",
          type: "home",
        },
      ],
      given_name: "Drew",
      grant_id: "49f23a2e-c7ac-4d7a-a712-d742ec473302",
      groups: [
        {
          id: "2000eb128b498835",
        },
        {
          id: "6ee326db0a4f430e",
        },
        {
          id: "7533c45c8968c144",
        },
        {
          id: "7ef6c35c0883a739",
        },
        {
          id: "myContacts",
        },
      ],
      id: "c2262900043029143395",
      im_addresses: [],
      job_title: "President",
      notes:
        "Timestamp: 1/26/2010 15:54:03\nEmail: andre.bigdog@gmail.com\nNotify me about:: Upcoming Events, Volunteer Opportunities, Activism @ WVU, National Action Alerts, kickin' ass!",
      object: "contact",
      phone_numbers: [
        {
          number: "(304) 397-0881",
          type: "home",
        },
        {
          number: "(703) 973 4389",
          type: "mobile",
        },
        {
          number: "(202) 567-7737",
          type: "googleVoice",
        },
      ],
      physical_addresses: [
        {
          city: "Lafayette",
          country: "US",
          postal_code: "80026",
          state: "CO",
          street_address: "1077 Artemis Circle",
          type: "home",
        },
        {
          city: "Denver",
          country: "US",
          postal_code: "80202",
          state: "CO",
          street_address: "1543 Champa Street",
          type: "work",
        },
      ],
      picture_url:
        "https://lh3.googleusercontent.com/cm/AGPWSu90vzPRevCFbB7GIHKwFKfl9SZY8oa8FNFTgNg5uPWtyK4Cb4wFeD6XKF5cO2d7rBrFxA=s100",
      surname: "Stromberg",
      source: "address_book",
      web_pages: [],
      updated_at: 1735296922,
    },
  },
  {
    email: "jason.chang1983@gmail.com",
    derivedName: "Jason Chang",
    latestMessage: undefined,
    nylasContact: {
      emails: [
        {
          email: "jason.chang1983@gmail.com",
        },
      ],
      given_name: "Jason",
      grant_id: "49f23a2e-c7ac-4d7a-a712-d742ec473302",
      groups: [
        {
          id: "160b38fa08f47114",
        },
      ],
      id: "c3855625816508315400",
      im_addresses: [],
      object: "contact",
      phone_numbers: [],
      physical_addresses: [],
      picture_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjUbq1QMcWrn_aRGDptgQ2mheV6g53cQGRTURz4bkssWKT6RYPFJbQ=s100",
      surname: "Chang",
      source: "address_book",
      web_pages: [],
      updated_at: 1733153129,
    },
  },
  {
    email: "jasonkado126@gmail.com",
    derivedName: "Jason Kado",
    latestMessage: undefined,
    nylasContact: {
      emails: [
        {
          email: "jasonkado126@gmail.com",
        },
      ],
      given_name: "Jason",
      grant_id: "49f23a2e-c7ac-4d7a-a712-d742ec473302",
      groups: [
        {
          id: "6e68afa70c9266d2",
        },
      ],
      id: "c8761447797588927026",
      im_addresses: [],
      object: "contact",
      phone_numbers: [],
      physical_addresses: [],
      picture_url:
        "https://lh3.googleusercontent.com/cm/AGPWSu__bF9ujXN-61kWILJpDEfmFyvbBjHdSipFSCrvrb4t5JUCguWQg-67XTArpoC9bXKwvA=s100",
      surname: "Kado",
      source: "address_book",
      web_pages: [],
      updated_at: 1733153120,
    },
  },
] as unknown as ForumContact[];

type SidebarProps = {
  contacts: ForumContactsResponse;
  selectedContacts: ForumContact[];
  onSetConversation: (contacts: ForumContact[]) => void;
  user: User;
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
};

export default function Sidebar({
  contacts,
  selectedContacts,
  onSetConversation,
  user,
  isDrawerOpen = false,
  onCloseDrawer,
}: SidebarProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const contactBoxes: SidebarContactBox[] = [
    {
      title: "Forum Group",
      startOpen: true,
      group: true,
      contacts: hardCodedGroupContacts,
    },
    {
      title: "Your Team",
      startOpen: false,
      contacts: contacts.teamContacts,
      domain: "@getforum.io",
    },
    {
      title: "Contacts",
      startOpen: true,
      contacts: contacts.contacts,
    },
    {
      title: "Misc",
      startOpen: false,
      contacts: contacts.nonContacts,
    },
  ];

  // Sidebar content
  const sidebarContent = (
    <div className="h-full col-span-2 px-2 flex flex-col gap-4 justify-between overflow-y-auto bg-white shadow-lg">
      <div className="flex flex-col gap-2">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <ForumLogo />
            </Link>
          </div>

          {/* menu */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-gray-900"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </div>
        </div>

        {/* search-forum */}
        <div className="w-full flex justify-end items-center relative">
          <input
            placeholder="Search Forum"
            className="border border-gray-300 rounded-full p-2 w-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute mr-2 w-10"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </div>
        {!contacts.contacts.length && <div>No contacts found</div>}

        {contactBoxes.map((box) => (
          <SidebarContactsBoxContainer
            key={box.title}
            box={box}
            selectedContacts={selectedContacts}
            onSelectContacts={onSetConversation}
          />
        ))}
      </div>

      {/* user-profile */}
      <SidebarUserProfile user={user} />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block h-full col-span-2">{sidebarContent}</div>
      {/* Mobile drawer */}
      {(
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 md:hidden ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onCloseDrawer}
            aria-label="Close sidebar backdrop"
          />
          {/* Drawer */}
          <div className={`fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-2xl transition-transform duration-300 md:hidden flex flex-col
            ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={onCloseDrawer}
              aria-label="Close sidebar"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="pt-12">{sidebarContent}</div>
          </div>
        </>
      )}
    </>
  );
}
