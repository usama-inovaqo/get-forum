import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { ComboboxOptionType } from "./combobox.types";

type ComboboxComponentProps = {
  options: ComboboxOptionType[];
  placeholder: string;
  selectedOptions: ComboboxOptionType[];
  onSetSelectedOptions: (options: ComboboxOptionType[]) => void;
};

export default function ComboboxComponent({
  options,
  placeholder,
  selectedOptions,
  onSetSelectedOptions,
}: ComboboxComponentProps) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
        return option.searchableLabel
          .toLowerCase()
          .includes(query.toLowerCase());
      });

  const handleChange = (updatedOptionsArray: ComboboxOptionType[]) => {
    onSetSelectedOptions(updatedOptionsArray);
    setQuery("");
  };

  return (
    <div className="flex items-center gap-2 flex-wrap w-full">
      <Combobox
        as="div"
        multiple
        value={selectedOptions}
        onChange={handleChange}
        onClose={() => setQuery("")}
      >
        {selectedOptions.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {selectedOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-1 border border-gray-300 rounded-full text-sm"
              >
                {option.display}
                <button
                  onClick={() =>
                    handleChange(
                      selectedOptions.filter((o) => o.id !== option.id)
                    )
                  }
                  className="hover:bg-gray-200 rounded-full p-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <ComboboxInput
          value={query}
          aria-label="Options"
          onChange={(event) => setQuery(event.target.value)}
          className={`focus:outline-none ${selectedOptions.length < 1 ? "w-full" : "w-auto"
            }`}
          placeholder={selectedOptions.length < 1 ? placeholder : undefined}
        />
        <ComboboxOptions
          anchor="bottom start"
          className="bg-white text-black p-2 text-sm border empty:invisible"
        >
          {filteredOptions.map((option) => (
            <ComboboxOption
              key={option.id}
              value={option}
              className="data-[focus]:bg-blue-50"
            >
              {option.dropdownDisplay || option.display}
            </ComboboxOption>
          ))}

          {query && filteredOptions.length === 0 && (
            <ComboboxOption
              value={{
                id: `${selectedOptions.length + 1}-${query}`,
                searchableLabel: query,
                display: query,
              }}
              onClick={() =>
                handleChange([
                  {
                    id: `${selectedOptions.length + 1}-${query}`,
                    searchableLabel: query,
                    display: query,
                  },
                ])
              }
              className="data-[focus]:bg-blue-100"
            >
              <button className="flex items-center gap-2 p-2">
                <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                <div className="flex flex-col items-start">
                  <div className="text-sm">{query}</div>
                </div>
              </button>
            </ComboboxOption>
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
