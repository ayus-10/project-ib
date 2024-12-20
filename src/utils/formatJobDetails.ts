export const formattedLocation = (location: string, type: string) =>
  `${location}${type !== "REMOTE" ? ` (${type})` : ""}`;

export const formattedDate = (date: string) =>
  new Date(date).toISOString().split("T")[0];
