export interface IRegisterInput {
  name: "username" | "email" | "password";
  type: string;
  placeholder: string;
}

export interface ILoginInput {
  name: "identifier" | "password";
  type: string;
  placeholder: string;
}

export interface ITodo {
  documentId: string;
  title: string;
  description: string;
  id?:number
}

export interface IErrorResponse {
  error: {
    message?: string;
    details?: {
      errors: {
        message: string;
      }[];
    };
  };
}
