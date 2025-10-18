"use client";

import { Button, TextField } from "@radix-ui/themes";
import "./SignupForm.scss";
import { useForm } from "react-hook-form";

export type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
};

type SignupFormProps = {
  onSubmit: (data: SignUpFormData) => Promise<void>;
  defaultValues?: Partial<SignUpFormData>;
};

const SignupForm = ({ onSubmit, defaultValues }: SignupFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues,
  });

  const password = watch("password");

  return (
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Username"
          type="text"
          {...register("username", { required: "Name is required" })}
        />
        {errors.username && (
          <span className="error">{errors.username.message}</span>
        )}
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Email"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>
      <div>
        <TextField.Root
          className="radix-textfield"
          placeholder="Repeat-Password"
          type="password"
          {...register("repeatPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        {errors.repeatPassword && (
          <span className="error">{errors.repeatPassword.message}</span>
        )}
      </div>
      <Button type="submit" mt={"4"} disabled={isSubmitting}>
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;
