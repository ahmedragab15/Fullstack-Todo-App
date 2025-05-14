import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { registerInputs } from "../data";
import { registerSchema } from "../validation";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

//* Handlers 
const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log("data ", data);

  //* Renders
  const renderRegisterInputs = registerInputs.map((input, idx) => (
    <div className="form-control" key={idx}>
      <Input type={input.type} placeholder={input.placeholder} {...register(input.name)} />
      {errors?.[input.name] && <InputErrorMessage message={errors[input.name]?.message} />}
    </div>
  ));
  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterInputs}
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
