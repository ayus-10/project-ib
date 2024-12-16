const isValidString = (data: unknown) =>
  typeof data === "string" && data.trim() !== "";

export const hasMinimumWords = (text: string) => text.split(" ").length >= 50;

export const areJobDetailsValid = (
  company: unknown,
  description: unknown,
  location: unknown,
  title: unknown
) =>
  isValidString(company) &&
  isValidString(description) &&
  isValidString(location) &&
  isValidString(title);
