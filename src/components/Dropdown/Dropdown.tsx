import { Button, DropdownMenu } from "@radix-ui/themes";
import { useState } from "react";

type DropdownProps = {
  name: string;
  options: string[];
  onChange: (value: string) => void;
};

const Dropdown = ({ name, options, onChange }: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger style={{ width: "100%" }}>
        <Button variant="soft">
          {name}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {options.map((option, index) => (
          <div key={option}>
            <DropdownMenu.Item
              style={{
                width: "var(--radix-popper-anchor-width)",
                textAlign: "center",
              }}
              onSelect={() => onChange(option)}
            >
              <p style={{ width: "100%" }}>{option}</p>
            </DropdownMenu.Item>
            {index !== options.length - 1 && <DropdownMenu.Separator />}
          </div>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
