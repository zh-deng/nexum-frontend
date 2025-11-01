import { Button, TextArea } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";
import "./FloatingTextArea.scss";

type FloatingTextAreaProps = ComponentPropsWithoutRef<typeof TextArea>;

function FloatingTextArea({
  placeholder,
  value,
  ...props
}: FloatingTextAreaProps) {
  const [hasValue, setHasValue] = useState<boolean>(false);
  const [hasNote, setHasNote] = useState<boolean>(false);

  useEffect(() => {
    setHasValue(!!value);
    setHasNote(!!value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value !== "");
    props.onChange?.(e);
  };

  return (
    <>
      {hasNote ? (
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
      ) : (
        <div>
          <Button
            style={{ cursor: "pointer" }}
            onClick={() => setHasNote(true)}
          >
            Add {placeholder}
          </Button>
        </div>
      )}
    </>
  );
}

export default FloatingTextArea;
