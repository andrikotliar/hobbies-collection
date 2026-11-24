import styles from './styles.module.css';
import { ArrowLeftIcon, LayoutGridIcon } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useMatches } from '@tanstack/react-router';
import { consoleMenuConfig } from '~/shared/configs/console-menu-config';
import { IconLink } from '~/shared/components/links/icon-link';
import { PageTitle } from '~/shared/components/layout/page-title';
import { Button } from '~/shared/components/controls/button';
import { PopupMenu } from '~/shared/components/ui/popup-menu';
import { getReducedTailwindColor } from '~/shared/helpers/get-reduced-tailwind-color';
import { defineCssProperties } from '~/shared/helpers/define-css-properties';

const menuItems = Object.values(consoleMenuConfig);

export const ConsoleHeader = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const matches = useMatches();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const routeMatch = matches.at(-1);
  const loaderData = routeMatch?.loaderData as Record<string, string | number> | undefined;

  return (
    <div className="flex justify-between gap-5 sticky top-0 bg-sky-50 z-100">
      <div className="flex gap-2.5 items-center">
        {routeMatch?.staticData.backPath && (
          <IconLink
            icon={<ArrowLeftIcon />}
            to={routeMatch.staticData.backPath}
            search={routeMatch?.staticData.preserveSearch ? location.search : undefined}
          />
        )}
        <PageTitle>{loaderData?.title ?? routeMatch?.staticData.title ?? 'Console'}</PageTitle>
      </div>
      {location.pathname !== '/console' && (
        <Button
          icon={
            <LayoutGridIcon
              className={clsx(styles.menu_icon, {
                [styles.menu_icon_collapsed]: !isMenuOpen,
              })}
              size={20}
            />
          }
          variant="ghost"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          ref={buttonRef}
        />
      )}
      <PopupMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        triggerRef={buttonRef}
        menuMargin={20}
        positionState="fixed"
      >
        <div className="flex flex-col p-2.5 max-h-100 md:max-h-1/2 gap-2.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className={clsx(
                `text-(--item-color)`,
                'flex items-center gap-2.5 p-2.5 rounded-lg border border-transparent text-center text-xs md:text-base',
                `hover:bg-(--reduced-item-color) hover:border-(--item-color)`,
              )}
              search={'search' in item ? item.search : undefined}
              style={defineCssProperties({
                '--item-color': item.color,
                '--reduced-item-color': getReducedTailwindColor(item.color),
              })}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      </PopupMenu>
    </div>
  );
};
