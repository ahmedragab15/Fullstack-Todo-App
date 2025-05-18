import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { registerInputs } from "../data";
import { registerSchema } from "../schema";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { IErrorResponse, IFormRegisterInput } from "../interfaces";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  //* States
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormRegisterInput>({
    resolver: yupResolver(registerSchema),
  });

  //* Handlers
  const onSubmit: SubmitHandler<IFormRegisterInput> = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/local/register", data);
      if (res.status >= 200 && res.status < 300) {
        toast.success("You are registered successfully, you will be redirected to login page", {
          duration: 1000,
          position: "bottom-center",
          style: {
            background: "#333",
            color: "#fff",
            width: "fit-content",
          },
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //* Renders
  const renderRegisterInputs = registerInputs.map((input, idx) => (
    <div className="form-control" key={idx}>
      <Input type={input.type} placeholder={input.placeholder} {...register(input.name)} />
      {errors[input.name] && <InputErrorMessage message={errors[input.name]?.message} />}
    </div>
  ));

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterInputs}
        <Button isLoading={isLoading} fullWidth type="submit">
          Register
        </Button>
        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>have an account?</span>
          <Link to={"/login"} className="underline text-blue-600 dark:text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
