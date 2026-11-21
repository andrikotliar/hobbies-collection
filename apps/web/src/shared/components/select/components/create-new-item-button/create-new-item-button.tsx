import styles from './styles.module.css';
import { Button } from '~/shared/components/button';
import { SaveIcon } from 'lucide-react';

type Props = {
  onCreate: VoidFunction;
};

export const CreateNewItemButton = ({ onCreate }: Props) => {
  return (
    <div className={styles.wrapper}>
      <Button variant="ghost" icon={<SaveIcon size={18} />} onClick={onCreate}>
        Save value
      </Button>
    </div>
  );
};
