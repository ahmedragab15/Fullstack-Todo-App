import { SubmitHandler, useForm } from "react-hook-form";
import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { loginInputs } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";
import { useState } from "react";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { Link } from "react-router-dom";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  //* States
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });
  
  //* Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/local", data);
      if (res.status === 200) {
        toast.success("You are logged successfully, you will be redirected to Home page", {
          duration: 1000,
          position: "bottom-center",
          style: {
            background: "#333",
            color: "#fff",
            width: "fit-content",
          },
        });
        localStorage.setItem("loggedInUser", JSON.stringify(res.data));
        setTimeout(() => {
          location.replace("/");
        }, 1500);
      }
    } catch (error) {
      const errorObject = error as AxiosError<IErrorResponse>;
      const errorMessage = errorObject?.response?.data?.error?.message;

      toast.error(`${errorMessage || "Something went wrong, please refresh the page and try again"}`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#E2241B",
          color: "#fff",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  //* Renders
  const renderLoginInputs = loginInputs.map((input, idx) => (
    <div className="form-control" key={idx}>
      <Input type={input.type} placeholder={input.placeholder} {...register(input.name)} />
      {errors[input.name] && <InputErrorMessage message={errors[input.name]?.message} />}
    </div>
  ));

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginInputs}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>No account?</span>
          <Link to={"/register"} className="underline text-indigo-600 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
