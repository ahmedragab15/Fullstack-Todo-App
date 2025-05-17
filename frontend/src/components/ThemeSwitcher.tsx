import { useEffect, useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { SunIcon, MoonIcon, ComputerDesktopIcon, CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { ITheme, Theme } from "../interfaces";

const themes: ITheme[] = [
  {
    name: "Light",
    value: "light",
    icon: <SunIcon className="w-5 h-5 text-yellow-500" />,
  },
  {
    name: "Dark",
    value: "dark",
    icon: <MoonIcon className="w-5 h-5 text-blue-500" />,
  },
  {
    name: "System",
    value: "system",
    icon: <ComputerDesktopIcon className="w-5 h-5 text-gray-500" />,
  },
];

const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", isDark);
  }
};

const ThemeSwitcher = () => {
  const [selected, setSelected] = useState(themes[2]);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme;
    const found = themes.find((t) => t.value === saved);
    if (found) {
      setSelected(found);
      applyTheme(found.value);
    }
  }, []);

  const handleChange = (themeOption: (typeof themes)[0]) => {
    setSelected(themeOption);
    localStorage.setItem("theme", themeOption.value);
    applyTheme(themeOption.value);
  };

  return (
    <div className="w-52">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 dark:text-white">
            <span className="flex items-center gap-2">
              {selected.icon}
              {selected.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
            {themes.map((theme) => (
              <ListboxOption key={theme.value} value={theme} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900 dark:bg-gray-700 dark:text-white" : "text-gray-900 dark:text-white"}`}>
                {({ selected }) => (
                  <>
                    <span className="flex items-center gap-2">
                      {theme.icon}
                      {theme.name}
                    </span>
                    {selected && (
                      <span className="absolute left-2 top-2">
                        <CheckIcon className="h-4 w-4 text-blue-600" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

export default ThemeSwitcher;