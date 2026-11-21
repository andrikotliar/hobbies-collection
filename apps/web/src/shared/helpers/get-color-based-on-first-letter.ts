const letterColors = {
  a: 'hsl(0, 60%, 85%)',
  b: 'hsl(14, 60%, 85%)',
  c: 'hsl(28, 60%, 85%)',
  d: 'hsl(42, 60%, 85%)',
  e: 'hsl(56, 60%, 85%)',
  f: 'hsl(70, 60%, 85%)',
  g: 'hsl(84, 60%, 85%)',
  h: 'hsl(98, 60%, 85%)',
  i: 'hsl(112, 60%, 85%)',
  j: 'hsl(126, 60%, 85%)',
  k: 'hsl(140, 60%, 85%)',
  l: 'hsl(154, 60%, 85%)',
  m: 'hsl(168, 60%, 85%)',
  n: 'hsl(182, 60%, 85%)',
  o: 'hsl(196, 60%, 85%)',
  p: 'hsl(210, 60%, 85%)',
  q: 'hsl(224, 60%, 85%)',
  r: 'hsl(238, 60%, 85%)',
  s: 'hsl(252, 60%, 85%)',
  t: 'hsl(266, 60%, 85%)',
  u: 'hsl(280, 60%, 85%)',
  v: 'hsl(294, 60%, 85%)',
  w: 'hsl(308, 60%, 85%)',
  x: 'hsl(322, 60%, 85%)',
  y: 'hsl(336, 60%, 85%)',
  z: 'hsl(350, 60%, 85%)',
};

export const getColorBaseOnFirstLetter = (value: string) => {
  const firstLetter = value.charAt(0).toLowerCase();

  return letterColors[firstLetter as keyof typeof letterColors];
};
