export const formatBnNumber = (
  value?: number | string,
  decimals = 2,
): number => {
  if (value === undefined || value === null) return 0;
  value = Number(value);
  return value / Math.pow(10, decimals);
};

export const formatNumber = (value?: number | string, decimals = 2): string => {
  value = value || 0;

  return value.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
};
