export const areAllNull = (...data: unknown[]) => data.every((d) => d === null);
export const areAllUndefined = (...data: unknown[]) =>
  data.every((d) => d === undefined);
