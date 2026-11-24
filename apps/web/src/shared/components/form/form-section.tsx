import { useState } from 'react';
import clsx from 'clsx';
import { Maximize2Icon, Minimize2Icon } from 'lucide-react';

type Props = {
  label?: string;
  children?: React.ReactNode;
};

export const FormSection = ({ children, label }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleContentVisibility = () => {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  };

  return (
    <div className="flex flex-col gap-5 border border-slate-300 bg-gray-50 p-5 rounded-lg">
      <div className="flex justify-between items-center gap-5">
        {label && <div className="text-lg font-bold">{label}</div>}
        <button
          onClick={toggleContentVisibility}
          className="flex items-center justify-center size-5 ml-auto hover:text-sky-600"
          type="button"
        >
          {isCollapsed ? <Maximize2Icon /> : <Minimize2Icon />}
        </button>
      </div>
      <div
        className={clsx({
          hidden: isCollapsed,
        })}
      >
        {children}
      </div>
    </div>
  );
};
