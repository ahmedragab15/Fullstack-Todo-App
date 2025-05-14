import { IRegisterFormInput } from "../interfaces";

export const registerInputs: IRegisterFormInput[] = [
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
