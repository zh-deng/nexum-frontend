"use client";

import { useForm } from "react-hook-form";
import "./LoginForm.scss";
import { Button, Checkbox, Flex, Text } from "@radix-ui/themes";
import FloatingTextField from "../../FloatingTextField/FloatingTextField";
import { useEffect, useState } from "react";

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
  });

  const [isDemo, setIsDemo] = useState<boolean>(true);

  useEffect(() => {
    if (isDemo) {
      setValue("email", "test@web.de");
      setValue("password", "password");
    } else {
      setValue("email", "");
      setValue("password", "");
    }
  }, [isDemo, setValue]);

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      {/* TODO handle email input better and validation */}
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
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Email"
          type="email"
          {...register("email", { required: "Email is required" })}
          disabled={isDemo}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>
      <div>
        <FloatingTextField
          className="radix-textfield"
          placeholder="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
          disabled={isDemo}
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
