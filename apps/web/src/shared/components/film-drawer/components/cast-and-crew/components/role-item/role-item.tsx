import styles from './role-item.module.css';
import clsx from 'clsx';
import { RoleTitle } from '../role-title/role-title';
import { RouterLink, type api, type ApiResponse } from '~/shared';

type RoleItemProps = {
  data: ApiResponse<typeof api.films.getById>['castAndCrew'][number];
};

export const RoleItem = ({ data }: RoleItemProps) => {
  const isActorRole = data.role === 'ACTOR';

  return (
    <div
      className={clsx(
        styles.role_item,
        isActorRole ? styles.role_item_actor : styles.role_item_default,
      )}
    >
      <RoleTitle role={data.role} />
      <ul
        className={clsx(
          styles.list_wrapper,
          isActorRole ? styles.list_wrapper_actor : styles.list_wrapper_default,
        )}
      >
        {data.people.map((person) => (
          <li key={person.id} className={styles.list_item}>
            <div className={clsx(!isActorRole && styles.link_wrapper)}>
              <RouterLink
                to="/films"
                search={{
                  personRole: data.role,
                  personId: person.id,
                }}
              >
                {person.name}
              </RouterLink>
              {isActorRole && (
                <>
                  <span className={styles.person_as_text}>as</span> {person.details}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
