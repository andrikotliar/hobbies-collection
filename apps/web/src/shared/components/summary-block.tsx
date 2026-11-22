import clsx from 'clsx';

type Props = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hasPadding?: boolean;
};

export const SummaryBlock = ({ label, icon, children, hasPadding = true }: Props) => {
  return (
    <div className="text-white items-start sm:items-stretch flex flex-col gap-1">
      {label && (
        <div className="flex items-center gap-1 text-xs uppercase shrink-0 tracking-tight">
          <div className="-rotate-10 [&>svg]:size-4.5">{icon}</div> <span>{label}</span>
        </div>
      )}
      <div className={clsx('bg-black/10 rounded-lg w-full', hasPadding && 'py-3 px-4')}>
        {children}
      </div>
    </div>
  );
};
