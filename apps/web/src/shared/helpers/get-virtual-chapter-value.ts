export const getVirtualChapterValue = (current: number | null, next: number | undefined | null) => {
  if (current === null) {
    return undefined;
  }

  if (next === undefined || next === null) {
    return current + 1;
  }

  return (current + next) / 2;
};
