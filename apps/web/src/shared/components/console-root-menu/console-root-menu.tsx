import styles from './styles.module.css';
import { Link } from '@tanstack/react-router';
import { consoleMenuConfig, consoleMenuGroups } from '~/shared/configs/console-menu-config';
import { colors } from '~/shared/configs/css-colors';
import { defineCssProperties } from '~/shared/helpers/define-css-properties';

export const ConsoleRootMenu = () => {
  return (
    <div className={styles.root}>
      {consoleMenuGroups.map((group) => (
        <div key={group.title}>
          <h2 className={styles.section_title}>{group.title}</h2>
          <div className={styles.menu}>
            {group.itemIds.map((itemId) => {
              const menuItem = consoleMenuConfig[itemId];

              return (
                <Link
                  key={itemId}
                  to={menuItem.route}
                  className={styles.menu_item}
                  style={defineCssProperties({
                    '--console-link-color': menuItem.color
                      ? colors[menuItem.color]
                      : colors.colorGrayPrimary,
                  })}
                  search={'search' in menuItem ? menuItem.search : undefined}
                >
                  <div className={styles.menu_icon}>{menuItem.icon}</div>
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
