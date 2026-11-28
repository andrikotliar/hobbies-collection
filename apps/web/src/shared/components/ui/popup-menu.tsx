import { FloatingElement } from './floating-element';

export const PopupMenu = (props: React.ComponentProps<typeof FloatingElement>) => {
  if (!props.isOpen) {
    return null;
  }

  return <FloatingElement {...props} />;
};
