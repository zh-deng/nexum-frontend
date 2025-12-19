"use client";

import { Button, TextArea } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";
import "./FloatingTextArea.scss";

type FloatingTextAreaProps = ComponentPropsWithoutRef<typeof TextArea> & {
  isFloating?: boolean;
  hasTrigger?: boolean;
};

function FloatingTextArea({
  placeholder,
  value,
  isFloating = true,
  hasTrigger = true,
  ...props
}: FloatingTextAreaProps) {
  const [hasValue, setHasValue] = useState<boolean>(false);
  const [hasTextArea, setHasTextArea] = useState<boolean>(!hasTrigger);

  useEffect(() => {
    if (value) {
      setHasValue(true);
      setHasTextArea(true);
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
      {hasTextArea ? (
        <div className="floating-textarea">
          <TextArea
            {...props}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            className="radix-textfield"
          />
          {hasValue && placeholder && isFloating && (
            <label className="floating-label">{placeholder}</label>
          )}
        </div>
      ) : (
        <Button
          className="trigger-button"
          style={{ cursor: "pointer" }}
          onClick={() => setHasTextArea(true)}
        >
          Add {placeholder}
        </Button>
      )}
    </>
  );
}

export default FloatingTextArea;
