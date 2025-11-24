"use client";

import { TextField } from "@radix-ui/themes";
import { useState, useEffect, type ComponentPropsWithoutRef } from "react";
import "./FloatingTextField.scss";

type FloatingTextFieldProps = ComponentPropsWithoutRef<
  typeof TextField.Root
> & { isFloating?: boolean };

export default function FloatingTextField({
  placeholder,
  value,
  defaultValue,
  isFloating = true,
  onChange,
  ...props
}: FloatingTextFieldProps) {
  const [hasValue, setHasValue] = useState(false);

  // Detect both prefilled and dynamic changes
  useEffect(() => {
    const val = value ?? defaultValue;
    setHasValue(Boolean(val && String(val).trim() !== ""));
  }, [value, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setHasValue(nextVal.trim() !== "");
    onChange?.(e);
  };

  return (
    <div className="floating-textfield">
      <TextField.Root
        {...props}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
      {hasValue && placeholder && isFloating && (
        <label className="floating-label">{placeholder}</label>
      )}
    </div>
  );
}
