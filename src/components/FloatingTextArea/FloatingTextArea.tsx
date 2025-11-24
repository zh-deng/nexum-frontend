"use client";

import { Button, TextArea } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";
import "./FloatingTextArea.scss";

type FloatingTextAreaProps = ComponentPropsWithoutRef<typeof TextArea> & {
  isFloating?: boolean;
};

function FloatingTextArea({
  placeholder,
  value,
  isFloating = true,
  ...props
}: FloatingTextAreaProps) {
  const [hasValue, setHasValue] = useState<boolean>(false);
  const [hasNote, setHasNote] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setHasValue(true);
      setHasNote(true);
    } else {
      setHasValue(false);
    }
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
          {hasValue && placeholder && isFloating && (
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
