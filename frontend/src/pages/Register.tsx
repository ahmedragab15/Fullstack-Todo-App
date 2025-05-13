import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log("data ",data);

  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Username" {...register("username", { required: "username is required", minLength:{value: 5, message: "username must be at least 5 characters"} })} />
        {errors.username && <span>{errors.username.message}</span>}
        <Input placeholder="Email address" {...register("email", { required: "email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "invalid email address" } })} />
        {errors.email && <span>{errors.email.message}</span>}
        <Input placeholder="Password" {...register("password", { required: "password is required", minLength: { value: 6, message: "password must be at least 6 characters" } })} />
        {errors.password && <span>{errors.password.message}</span>}
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
