export const getReducedTailwindColor = (color: string) => {
  const matches = color.match(/\d+/);

  if (!matches?.length) {
    return color;
  }

  const num = Number(matches[0]);
  const reduced = num - 200;
  const targetNum = reduced < 50 ? 50 : reduced;

  return color.replace(/\d+/, targetNum.toString());
};
