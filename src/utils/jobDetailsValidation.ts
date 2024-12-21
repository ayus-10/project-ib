export const isValidString = (data: unknown) =>
  typeof data === "string" && data.trim() !== "";

export const isValidNumber = (data: unknown) => typeof data === "number";

const isValidDate = (date: unknown) =>
  typeof date === "string" && !Number.isNaN(Date.parse(date));

const isValidJobType = (type: unknown) =>
  typeof type === "string" && ["REMOTE", "HYBRID", "ONSITE"].includes(type);

export const hasMinimumWords = (text: string) => text.split(" ").length >= 50;

export const areJobDetailsValid = (
  company: unknown,
  description: unknown,
  location: unknown,
  title: unknown,
  created: unknown,
  deadline: unknown,
  type: unknown
) =>
  isValidString(company) &&
  isValidString(description) &&
  isValidString(location) &&
  isValidString(title) &&
  isValidDate(created) &&
  isValidDate(deadline) &&
  isValidJobType(type);
