import styles from './styles.module.css';
import { ArrowLeftIcon, LayoutGridIcon } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useMatches } from '@tanstack/react-router';
import { colors } from '~/shared/configs/css-colors';
import { consoleMenuConfig } from '~/shared/configs/console-menu-config';
import { IconLink } from '~/shared/components/icon-link/icon-link';
import { PageTitle } from '~/shared/components/page-title/page-title';
import { Button } from '~/shared/components/button';
import { PopupMenu } from '~/shared/components/popup-menu/popup-menu';
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
    <div className={styles.console_header}>
      <div className={styles.title_column}>
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
        <div className={styles.console_menu}>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className={styles.console_link}
              style={defineCssProperties({
                '--console-float-menu-color': item.color
                  ? colors[item.color]
                  : colors.colorGrayPrimary,
              })}
              search={'search' in item ? item.search : undefined}
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
