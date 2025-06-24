import { ReactNode } from "react";

export type ComboboxOptionType = {
    id: string;
    searchableLabel: string;
    display: ReactNode;
    profilePicture?: string;
    dropdownDisplay?: ReactNode;
}