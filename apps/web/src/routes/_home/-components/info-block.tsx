import { XCircleIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '~/shared/components/controls/button';

type Props = {
  label: string;
  title: string;
  description?: string | null;
};

export const InfoBlock = ({ label, title, description }: Props) => {
  const navigate = useNavigate();

  const handleClearFilter = () => {
    navigate({ to: '/', replace: true });
  };

  return (
    <div className="relative flex justify-between items-start gap-5 border border-slate-300 rounded-lg px-5 py-4">
      <div className="flex flex-col justify-end gap-1">
        <div className="uppercase text-xs text-slate-600">{label}</div>
        <h2 className="text-lg xs:text-2xl text-sky-600 font-bold capitalize">{title}</h2>
        {description && <p className="text-black text-xs leading-normal">{description}</p>}
      </div>
      <Button onClick={handleClearFilter} icon={<XCircleIcon size={20} />} variant="ghost" />
    </div>
  );
};
