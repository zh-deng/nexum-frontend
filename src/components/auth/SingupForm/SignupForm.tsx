"use client";

import { Box, Button, Flex, Spinner } from "@radix-ui/themes";
import "./SignupForm.scss";
import { useForm } from "react-hook-form";
import FloatingTextField from "../../FloatingTextField/FloatingTextField";
import { validateEmail } from "../../../utils/helper";
import InfoBox from "../../InfoBox/InfoBox";
import Link from "next/link";

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
      <InfoBox
        text={"Currently in closed Beta. Signup access code required."}
      />
      <Flex align={"center"} gap={"4"}>
        <Box width={"100%"}>
          <InfoBox text={"Try out the demo version instead."} />
        </Box>
        <Link href="/login" className="demo-link">
          <Button size={"3"} style={{ cursor: "pointer" }}>
            Demo
          </Button>
        </Link>
      </Flex>
      <Button
        type={"submit"}
        style={{ cursor: "pointer" }}
        mt={"4"}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner size="2" /> : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignupForm;
