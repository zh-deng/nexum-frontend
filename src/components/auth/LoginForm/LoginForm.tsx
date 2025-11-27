"use client";

import "./LoginForm.scss";
import { useForm } from "react-hook-form";
import { Button, Checkbox, Flex, Spinner, Text } from "@radix-ui/themes";
import FloatingTextField from "../../FloatingTextField/FloatingTextField";
import { useEffect, useState } from "react";
import { validateEmail } from "../../../utils/helper";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../../../utils/environment";
import InfoBox from "../../InfoBox/InfoBox";

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const [isDemo, setIsDemo] = useState<boolean>(true);

  useEffect(() => {
    if (isDemo) {
      setValue("email", DEMO_EMAIL);
      setValue("password", DEMO_PASSWORD);
    } else {
      setValue("email", "");
      setValue("password", "");
    }
  }, [isDemo, setValue]);

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <Text>
        <Flex gap={"2"} align={"center"}>
          <Checkbox
            size={"3"}
            checked={isDemo}
            onCheckedChange={(val) => setIsDemo(val === true)}
          />
          Log into demo version
        </Flex>
      </Text>
      <InfoBox text={"Demo data will be reset every day"} />
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder={"Email"}
          type={"email"}
          disabled={isDemo}
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
          disabled={isDemo}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>
      <Button
        type={"submit"}
        style={{ cursor: "pointer" }}
        mt={"4"}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner size="2" /> : "Log In"}
      </Button>
    </form>
  );
};

export default LoginForm;
