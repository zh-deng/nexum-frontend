"use client";

import { Button, Text } from "@radix-ui/themes";
import "./SignupForm.scss";
import { useForm } from "react-hook-form";
import FloatingTextField from "../../FloatingTextField/FloatingTextField";
import { validateEmail } from "../../../utils/helper";
import InfoBox from "../../InfoBox/InfoBox";

export type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  signupAccessCode: string;
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
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  return (
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <FloatingTextField
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
        <FloatingTextField
          className="radix-textfield"
          placeholder="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            validate: {
              isValid: (value) =>
                validateEmail(value) || "Please enter a valid email address",
            },
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder={"Password"}
          type={"password"}
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder={"Repeat-Password"}
          type={"password"}
          {...register("repeatPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        {errors.repeatPassword && (
          <span className="error">{errors.repeatPassword.message}</span>
        )}
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder={"Signup Access Code"}
          type={"text"}
          {...register("signupAccessCode", {
            required: "Invite code is required",
          })}
        />
        {errors.signupAccessCode && (
          <span className="error">{errors.signupAccessCode.message}</span>
        )}
      </div>
      <InfoBox text={"Currently in closed Beta. Signup access code required"} />
      <Button
        type={"submit"}
        style={{ cursor: "pointer" }}
        mt={"4"}
        disabled={isSubmitting}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;
