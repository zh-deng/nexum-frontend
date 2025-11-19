import { Button, DropdownMenu } from "@radix-ui/themes";
import { humanizeEnumLabel } from "../../utils/humanize";

type Opt = string | { value: string; label: string };

type DropdownProps = {
  name: string;
  options: Opt[];
  width?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const Dropdown = ({
  name,
  options,
  onChange,
  width,
  disabled,
}: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        style={{ width: `${width ?? "100%"}` }}
        disabled={disabled}
      >
        <Button variant="soft" style={{ cursor: "pointer" }}>
          {typeof name === "string" && /^[A-Z0-9_]+$/.test(name)
            ? humanizeEnumLabel(name)
            : name}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {options.map((option, index) => {
          const value = typeof option === "string" ? option : option.value;
          let label = typeof option === "string" ? option : option.label;
          // auto-humanize enum-like constants (e.g. DATE_NEW -> Date New)
          if (typeof option === "string" && /^[A-Z0-9_]+$/.test(option)) {
            label = humanizeEnumLabel(option);
          }
          return (
            <div key={value}>
              <DropdownMenu.Item
                style={{
                  width: "var(--radix-popper-anchor-width)",
                  textAlign: "center",
                }}
                onSelect={() => onChange(value)}
              >
                <p style={{ width: "100%" }}>{label}</p>
              </DropdownMenu.Item>
              {index !== options.length - 1 && <DropdownMenu.Separator />}
            </div>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
