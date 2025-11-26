import "./Dropdown.scss";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { humanizeEnumLabel } from "../../utils/helper";
import React from "react";

type Opt = string | { value: string; label: string };

type DropdownProps = {
  name: string;
  options: Opt[];
  width?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const PATTERN = /^[A-Z0-9_]+$/;

const Dropdown = ({
  name,
  options,
  onChange,
  width,
  disabled,
}: DropdownProps) => {
  const triggerText = PATTERN.test(name) ? humanizeEnumLabel(name) : name;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        style={{ width: `${width ?? "100%"}` }}
        disabled={disabled}
      >
        <Button variant={"soft"} style={{ cursor: "pointer" }}>
          {triggerText}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {options.map((option, index) => {
          const value = typeof option === "string" ? option : option.value;
          let label = typeof option === "string" ? option : option.label;
          // auto-humanize enum-like constants (e.g. DATE_NEW -> Date New)
          if (typeof option === "string" && PATTERN.test(option)) {
            label = humanizeEnumLabel(option);
          }

          return (
            <React.Fragment key={value}>
              <DropdownMenu.Item
                style={{
                  width: "calc(var(--radix-popper-anchor-width) - 15px)",
                  textAlign: "center",
                }}
                onClick={() => onChange(value)}
              >
                <span style={{ width: "100%" }}>{label}</span>
              </DropdownMenu.Item>
              {index !== options.length - 1 && <DropdownMenu.Separator />}
            </React.Fragment>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
