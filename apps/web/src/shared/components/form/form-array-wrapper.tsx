import { PlusIcon } from 'lucide-react';
import { Button } from '~/shared/components/controls/button';

type Props = {
  onCreate: VoidFunction;
  createButtonLabel?: string;
  children?: React.ReactNode;
};

export const FormArrayWrapper = ({ children, onCreate, createButtonLabel = 'Add item' }: Props) => {
  return (
    <div className="flex flex-col gap-5">
      {children}
      <div>
        <Button onClick={onCreate} icon={<PlusIcon />} variant="secondary">
          {createButtonLabel}
        </Button>
      </div>
    </div>
  );
};
