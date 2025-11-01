"use client";

import { useForm } from "react-hook-form";
import "./LoginForm.scss";
import { Button } from "@radix-ui/themes";
import FloatingTextField from "../../FloatingTextField/FloatingTextField";

export type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => Promise<void>;
  defaultValues?: Partial<LoginFormData>;
};

const LoginForm = ({ onSubmit, defaultValues }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues,
  });

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      {/* TODO handle email input better and validation */}
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Email"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>
      <Button
        type="submit"
        style={{ cursor: "pointer" }}
        mt={"4"}
        disabled={isSubmitting}
      >
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;
