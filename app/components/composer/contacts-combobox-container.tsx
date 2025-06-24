import Image from "next/image";
import ComboboxComponent from "../combobox/combobox";
import { NylasContact } from "@/app/types/contacts.types";
import { ComboboxOptionType } from "../combobox/combobox.types";

type ContactsComboboxContainerProps = {
    availableContacts: NylasContact[];
    selectedContactsAsEmailStrings: string[];
    onChange: (options: NylasContact[]) => void;
    placeholder: string;
};

export default function ContactsComboboxContainer({ availableContacts, selectedContactsAsEmailStrings, onChange, placeholder }: ContactsComboboxContainerProps) {
    const unSelectedContacts = availableContacts.filter(contact => !selectedContactsAsEmailStrings.includes(contact.emails[0].email));

    const options: ComboboxOptionType[] = unSelectedContacts.map((contact) => ({
        id: contact.id,
        profilePicture: contact.picture_url,
        searchableLabel: contact.given_name + ' (' + contact.emails[0].email + ')',
        display:
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                <div className="text-sm">{contact.given_name} ({contact.emails[0].email})</div>
            </div>,
        dropdownDisplay:
            <button className="flex items-center gap-2 p-2">
                {contact.picture_url ?
                    <Image
                        src={contact.picture_url}
                        alt={contact.given_name}
                        width={25}
                        height={25}
                        className="w-5 h-5 bg-gray-300 rounded-full"
                    />
                    :
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                }
                <div className="flex flex-col items-start">
                    <div className="text-sm">{contact.given_name}</div>
                    <div className="text-xs font-medium">{contact.emails[0].email}</div>
                </div>
            </button>,
    }));

    const reshapedSelectedContacts: ComboboxOptionType[] = availableContacts
        .filter(contact => selectedContactsAsEmailStrings.includes(contact.emails[0].email))
        .map((contact) => ({
            id: contact.id,
            profilePicture: contact.picture_url,
            searchableLabel: contact.given_name + ' (' + contact.emails[0].email + ')',
            display:
                <div className="flex items-center gap-2">
                    {contact.picture_url ?
                        <Image
                            src={contact.picture_url}
                            alt={contact.given_name}
                            width={25}
                            height={25}
                            className="w-5 h-5 bg-gray-300 rounded-full"
                        />
                        :
                        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    }
                    <div className="text-sm">{contact.given_name} ({contact.emails[0].email})</div>
                </div>,
        }));

    const handleSetSelectedContacts = (options: ComboboxOptionType[]) => {
        // Find existing contacts and create new ones if needed
        const selectedNylasContacts = options.map(option => {
            const existingContact = availableContacts.find(contact => contact.id === option.id);

            if (existingContact) return existingContact;

            // Extract email from searchableLabel (format: "name (email)")
            const email = option.searchableLabel;

            // Create new ephemeral NylasContact "contact" that can be used in the composer
            return {
                emails: [{ email }],
                given_name: "",
                grant_id: '',
                groups: [],
                id: option.id,
                im_addresses: [],
                object: 'contact',
                phone_numbers: [],
                physical_addresses: [],
                picture_url: '',
                surname: '',
                source: 'manual',
                web_pages: [],
                updated_at: Date.now(),
                job_title: ''
            };
        });

        onChange(selectedNylasContacts);
    }

    return (
        <ComboboxComponent
            options={options}
            placeholder={placeholder}
            selectedOptions={reshapedSelectedContacts}
            onSetSelectedOptions={handleSetSelectedContacts}
        />
    );
}
