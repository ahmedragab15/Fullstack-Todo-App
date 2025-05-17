import { TextareaHTMLAttributes } from "react";

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = ({ ...rest }: IProps) => {
  return <textarea className="border-[1px] border-gray-300 dark:border-gray-500 shadow-md focus:border-blue-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent" rows={6} {...rest} />;
};

export default Textarea;
