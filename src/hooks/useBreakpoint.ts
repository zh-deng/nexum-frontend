import { useEffect, useState } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export function useBreakpoint() {
  const getInitial = (): Breakpoint => {
    if (typeof window === "undefined") return "md"; // sensible default for SSR
    const width = window.innerWidth;
    if (width >= 1280) return "xl";
    if (width >= 1024) return "lg";
    if (width >= 768) return "md";
    if (width >= 480) return "sm";
    return "xs";
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getInitial);

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
