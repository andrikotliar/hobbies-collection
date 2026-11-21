import { FloatingElement } from './components/floating-element/floating-element';

export const PopupMenu = (props: React.ComponentProps<typeof FloatingElement>) => {
  if (!props.isOpen) {
    return null;
  }

  return <FloatingElement {...props} />;
};
