import { ILoginInput, IRegisterInput } from "../interfaces";

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
