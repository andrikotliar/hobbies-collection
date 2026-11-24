import clsx from 'clsx';
import { useRef, useState } from 'react';
import { PopupMenu } from '../ui/popup-menu';
import type { ListOption, SortingOrder } from '@hobbies-collection/shared';
import { ArrowDownAZIcon, ArrowUpAZIcon } from 'lucide-react';
import { Button } from '~/shared/components/controls/button';
import { sortingDirectionOptions } from '~/shared/configs/sorting-direction-options';

export type SortingParams = {
  orderKey?: string;
  order?: SortingOrder;
};

type Props = {
  fields: ListOption<string, { isNotSelectable?: boolean }>[];
  defaultOrderKey: string;
  defaultOrder: SortingOrder;
  onSorting: (params: SortingParams) => void;
  isDisabled?: boolean;
  buttonWrapperClassName?: string;
};

const getDefaultLabel = (fields: ListOption<string>[], selectedSortingField?: string) => {
  if (!selectedSortingField) {
    return fields[0].label;
  }

  const option = fields.find((option) => option.value === selectedSortingField);

  return option?.label ?? fields[0].label;
};

export const SortingPopup = ({
  fields,
  onSorting,
  defaultOrderKey,
  defaultOrder,
  isDisabled = false,
  buttonWrapperClassName,
}: Props) => {
  const sortingPopupButton = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const availableToSelectFields = fields.filter((field) => !field.isNotSelectable);

  const selectedData = {
    label: getDefaultLabel(fields, defaultOrderKey),
    order: defaultOrder,
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleSorting = (field: ListOption<string>, order: SortingOrder) => {
    onSorting({
      orderKey: field.value,
      order,
    });
    handleClose();
  };

  return (
    <>
      <div className={buttonWrapperClassName}>
        <Button
          onClick={handleToggle}
          ref={sortingPopupButton}
          variant="light"
          icon={selectedData.order === 'asc' ? <ArrowDownAZIcon /> : <ArrowUpAZIcon />}
          fitWidth
          isDisabled={isDisabled}
        />
      </div>
      <PopupMenu
        isOpen={isOpen}
        triggerRef={sortingPopupButton}
        onClose={handleClose}
        shouldAdjustToTriggerWidth={false}
        className="flex flex-col gap-2.5 p-5"
      >
        {availableToSelectFields.map((field) => {
          const isActiveField = defaultOrderKey === field.value;

          return (
            <div
              className="text-sm flex items-center justify-between gap-5 pb-2.5 border-b border-b-slate-300 last:border-b-0 last:pb-0"
              key={field.value}
            >
              <div
                className={clsx('font-semibold mr-2.5 shrink-0', isActiveField && 'text-sky-600')}
              >
                {field.label}
              </div>
              <div className="flex items-center gap-2.5">
                {sortingDirectionOptions.map((option) => (
                  <button
                    className={clsx(
                      'text-xs text-sky-600 border border-sky-600 py-1 px-2.5 transition-colors',
                      'hover:not-disabled:bg-sky-200',
                      isActiveField &&
                        selectedData.order === option.value &&
                        'bg-sky-600 text-white cursor-default pointer-events-none',
                    )}
                    onClick={() => handleSorting(field, option.value)}
                    key={option.value}
                    disabled={isActiveField && defaultOrder === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </PopupMenu>
    </>
  );
};
