import { TextField } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";
import "./FloatingTextField.scss";

type FloatingTextFieldProps = ComponentPropsWithoutRef<typeof TextField.Root>;

function FloatingTextField({
  placeholder,
  value,
  ...props
}: FloatingTextFieldProps) {
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value !== "");
    props.onChange?.(e);
  };

  return (
    <div className="floating-textfield">
      <TextField.Root
        {...props}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {hasValue && placeholder && (
        <label className="floating-label">{placeholder}</label>
      )}
    </div>
  );
}

export default FloatingTextField;
