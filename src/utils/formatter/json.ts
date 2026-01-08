export const safeParse = <T>(
  jsonString: string,
  defaultValue: T | null,
): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
};
