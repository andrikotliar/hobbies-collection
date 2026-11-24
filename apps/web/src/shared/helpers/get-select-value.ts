export const getSelectValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  return [];
};
