import type { Enum, PersonRole } from '@hobbies-collection/shared';
import styles from './styles.module.css';
import { personRoleToTitle } from '~/shared/configs/person-role-to-title';

type Props = {
  role: Enum<typeof PersonRole>;
};

export const RoleTitle = ({ role }: Props) => {
  return <h3 className={styles.title}>{personRoleToTitle[role]}</h3>;
};
