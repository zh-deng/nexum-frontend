import { useEffect, useState } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  const isXl = breakpoint === "xl";
  const isLg = breakpoint === "lg" || isXl;
  const isMd = breakpoint === "md" || isLg;
  const isSm = breakpoint === "sm" || isMd;

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1280) setBreakpoint("xl");
      else if (width >= 1024) setBreakpoint("lg");
      else if (width >= 768) setBreakpoint("md");
      else if (width >= 480) setBreakpoint("sm");
      else setBreakpoint("xs");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    breakpoint,
    isSm: isSm,
    isMd: isMd,
    isLg: isLg,
    isXl: isXl,
  };
}
