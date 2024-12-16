const isValidString = (data: unknown) =>
  typeof data === "string" && data.trim() !== "";

const isValidDate = (date: unknown) =>
  typeof date === "string" && !Number.isNaN(Date.parse(date));

export const hasMinimumWords = (text: string) => text.split(" ").length >= 50;

export const areJobDetailsValid = (
  company: unknown,
  description: unknown,
  location: unknown,
  title: unknown,
  created: unknown,
  deadline: unknown
) =>
  isValidString(company) &&
  isValidString(description) &&
  isValidString(location) &&
  isValidString(title) &&
  isValidDate(created) &&
  isValidDate(deadline);
