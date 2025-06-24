export const formatUnixTimestamp = (
  timestamp?: number | null,
  format: "full" | "date" | "time" | "mmdd" = "full"
): string | null => {
  if (!timestamp) return null;

  const date = new Date(timestamp * 1000);

  switch (format) {
    case "date":
      return date.toLocaleDateString();
    case "time":
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "mmdd":
      return date.toLocaleString([], {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "full":
    default:
      return date.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
  }
};
