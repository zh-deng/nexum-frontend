// Helper to clean out optional fields before submitting to the api

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeEmptyStrings(obj: any): any {
  if (Array.isArray(obj)) {
    return obj; // Return arrays unchanged
  }

  if (typeof obj !== "object" || obj === null) {
    return obj; // Return primitives and null unchanged
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleaned: any = {};

  for (const key in obj) {
    const value = obj[key];

    // Only remove empty strings, keep everything else
    if (value !== "") {
      cleaned[key] =
        typeof value === "object" && value !== null
          ? removeEmptyStrings(value)
          : value;
    }
  }

  return cleaned;
}

export function formatDateUs(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
