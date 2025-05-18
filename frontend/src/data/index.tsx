import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/outline';
import { SunIcon } from '@heroicons/react/24/outline';
import { ILoginInput, IRegisterInput, ITheme } from "../interfaces";

export const registerInputs: IRegisterInput[] = [
  {
    name: "username",
    type: "text",
    placeholder: "Enter your username",
  },
  {
    name: "email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Enter your password",
  },
];

export const loginInputs: ILoginInput[] = [
  {
    name: "identifier",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Enter your password",
  },
];

export const themes: ITheme[] = [
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