import { TextArea } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";
import "./FloatingTextArea.scss";

type FloatingTextAreaProps = ComponentPropsWithoutRef<typeof TextArea>;

function FloatingTextArea({
  placeholder,
  value,
  ...props
}: FloatingTextAreaProps) {
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value !== "");
    props.onChange?.(e);
  };

  return (
    <div className="floating-textarea">
      <TextArea
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

export default FloatingTextArea;
