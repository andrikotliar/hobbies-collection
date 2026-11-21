import { Trash2Icon } from 'lucide-react';
import { Button } from '~/shared/components/button';

type Props = {
  onRemove: VoidFunction;
  children?: React.ReactNode;
};

export const FormArrayFieldWrapper = ({ children, onRemove }: Props) => {
  return (
    <div className="flex items-start gap-3.5 p-3.5 bg-white border border-slate-300 rounded-lg">
      <div className="flex flex-col gap-3.5 grow overflow-x-auto overflow-y-hidden">{children}</div>
      <Button icon={<Trash2Icon />} variant="ghost" onClick={onRemove} />
    </div>
  );
};
