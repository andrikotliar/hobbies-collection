import { Button } from '~/shared/components/controls/button';
import clsx from 'clsx';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { Loader } from '~/shared/components/ui/loader';

type Props = {
  onClick: VoidFunction;
  onClear: VoidFunction;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: (event: React.KeyboardEvent) => void;
  displayedValue?: string;
  isActive: boolean;
  isDisabled: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  shouldShowClearButton: boolean;
  ref?: React.RefObject<HTMLInputElement | null>;
};

const iconClassNames = clsx('text-slate-400 group-hover:text-slate-600');

export const TriggerButton = ({
  onClick,
  onClear,
  onKeyDown,
  onChange,
  displayedValue,
  isActive,
  isDisabled,
  isLoading,
  isSearchable = true,
  shouldShowClearButton,
  ref,
}: Props) => {
  return (
    <div className="relative bg-white rounded-lg group">
      <input
        ref={ref}
        onClick={onClick}
        className={clsx(
          'peer relative w-full p-2.5 rounded-lg border border-slate-300 bg-transparent z-2 focus:outline-1',
          'focus:outline-sky-600 hover:border-slate-600',
          'disabled:select-none disabled:pointer-events-none disabled:cursor-default disabled:bg-slate-100',
          'read-only:cursor-pointer',
        )}
        onKeyDown={onKeyDown}
        onChange={onChange}
        type="text"
        disabled={isDisabled}
        aria-haspopup="listbox"
        readOnly={!isSearchable}
        placeholder=""
      />
      <div
        className={clsx(
          'absolute top-1/2 left-2.5 -translate-y-1/2 opacity-0',
          'peer-disabled:text-slate-600 peer-disabled:z-2 peer-disabled:select-none',
          'peer-placeholder-shown:opacity-100',
        )}
      >
        {displayedValue}
      </div>
      <div className="flex gap-1 absolute top-1/2 right-2.5 -translate-y-1/2 z-10">
        {isLoading && <Loader size={18} shouldInheritColor />}
        {shouldShowClearButton && !isLoading && (
          <Button
            icon={<XIcon className={iconClassNames} size={18} />}
            variant="ghost"
            onClick={onClear}
            aria-label="Clear selection"
          />
        )}
        <ChevronDownIcon
          size={20}
          className={clsx(
            iconClassNames,
            'ml-auto transition-transform',
            isActive && '-rotate-180',
          )}
        />
      </div>
    </div>
  );
};
