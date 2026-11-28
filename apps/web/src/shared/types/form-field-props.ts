import type { JSX, JSXElementConstructor } from 'react';

export type FormFieldProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = {
  name: string;
} & React.ComponentProps<T>;
