import clsx from 'clsx';
import { Loader } from '~/shared/components/ui/loader';
import { defineCssProperties } from '~/shared/helpers/define-css-properties';
import { XIcon } from 'lucide-react';
import { BLOCKING_SCROLL_CLASS_NAME } from '~/shared/constants/app';

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  heightReducer?: `${string}px`;
  topPositionMargin?: `${string}px`;
  children?: React.ReactNode;
};

const SidebarContentWrapper = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={clsx(
        'fixed shrink-0 w-full h-full! left-0 top-0 bottom-25 z-9999 hidden transition-transform translate-y-5 overflow-hidden md:rounded-lg md:border md:border-slate-300',
        'md:w-75 md:sticky md:top-(--sidebar-top-position-margin) md:h-[calc(100vh-40px-var(--sidebar-height-reducer))]',
        className,
      )}
      {...props}
    />
  );
};

export const FiltersSidebar = ({
  isOpen,
  onToggle,
  isLoading = false,
  heightReducer = '0px',
  topPositionMargin = '0px',
  children,
}: Props) => {
  const cssProperties = defineCssProperties({
    '--sidebar-height-reducer': heightReducer,
    '--sidebar-top-position-margin': topPositionMargin,
  });

  if (isLoading) {
    return (
      <SidebarContentWrapper style={cssProperties}>
        <Loader />
      </SidebarContentWrapper>
    );
  }

  return (
    <SidebarContentWrapper
      className={clsx({
        'visible translate-y-0': isOpen,
        [BLOCKING_SCROLL_CLASS_NAME]: isOpen,
      })}
      style={cssProperties}
    >
      {children}
      <button
        onClick={onToggle}
        className="absolute bottom-5 right-2.5 bg-slate-300 rounded-full size-10 flex items-center justify-center md:hidden"
      >
        <XIcon />
      </button>
    </SidebarContentWrapper>
  );
};
