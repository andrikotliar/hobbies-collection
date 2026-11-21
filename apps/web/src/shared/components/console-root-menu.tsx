import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { consoleMenuConfig, consoleMenuGroups } from '~/shared/configs/console-menu-config';
import { getReducedTailwindColor } from '~/shared/helpers/get-reduced-tailwind-color';

export const ConsoleRootMenu = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      {consoleMenuGroups.map((group) => (
        <div key={group.title}>
          <h2 className="font-stretch-ultra-condensed text:lg md:text-2xl mb-2.5">{group.title}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5 w-full">
            {group.itemIds.map((itemId) => {
              const menuItem = consoleMenuConfig[itemId];

              return (
                <Link
                  key={itemId}
                  to={menuItem.route}
                  className={clsx(
                    'text-white flex flex-col items-center justify-center gap-2.5 w-full h-30 shrink-0 rounded-lg text-center',
                    'transition-shadow shadow-md hover:shadow-xl',
                    `bg-linear-45 from-${menuItem.color} to-${getReducedTailwindColor(menuItem.color)}`,
                  )}
                  search={'search' in menuItem ? menuItem.search : undefined}
                >
                  <div className="text-5xl [&>svg]:size-10">{menuItem.icon}</div>
                  {menuItem.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
