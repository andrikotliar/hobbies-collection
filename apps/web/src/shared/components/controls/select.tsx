import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldLabel } from '~/shared/components/ui/field-label';
import { PopupMenu } from '~/shared/components/ui/popup-menu';
import { FieldError } from '~/shared/components/ui/field-error';
import type { ListOption } from '@hobbies-collection/shared';
import type { FormError } from '~/shared/types/form-error';
import { useDebouncedSearch } from '~/shared/hooks/use-debounced-search';
import { TriggerButton } from '../select-trigger-button';
import { getSelectValue } from '~/shared/helpers/get-select-value';
import clsx from 'clsx';
import { Button } from '~/shared/components/controls/button';
import { SaveIcon, XIcon } from 'lucide-react';

type Props<T extends ListOption<any>> = {
  label?: string;
  error?: FormError;
  options: T[];
  value?: string | string[] | number | number[] | null;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  isOptionsLoading?: boolean;
  onSelect: (value: any, option?: T) => void;
  onOptionsSearch?: (value: string | null) => void;
  onCreateOption?: (value: string) => Promise<T> | T;
  onClear?: VoidFunction;
};

export const Select = <T extends ListOption<any>>({
  options,
  label,
  error,
  value = null,
  isMulti = false,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  placeholder = 'Select...',
  isOptionsLoading = false,
  onSelect,
  onOptionsSearch,
  onCreateOption,
  onClear,
}: Props<T>) => {
  const selectedValues = useMemo(() => {
    return getSelectValue(value);
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);
  const optionsWrapperRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLButtonElement[]>([]);
  const focusedIndex = useRef(-1);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState(options);

  const handleToggleDropdown = useCallback(() => {
    setIsDropdownOpen((isOpen) => !isOpen);
  }, []);

  const handleSearch = useDebouncedSearch((value) => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }

    if (typeof onOptionsSearch === 'function') {
      onOptionsSearch(value);
      return;
    }

    if (!value) {
      setInternalOptions(options);
      return;
    }

    setInternalOptions(() => {
      return options.filter((option) => {
        return option.label.toLowerCase().includes(value);
      });
    });
  });

  const setInputValue = (value: string) => {
    if (inputRef?.current) {
      inputRef.current.value = value;
    }
  };

  const handleFinishSelection = useCallback(
    (newOption?: T) => {
      setIsDropdownOpen(false);
      const resetOptions = [...options];
      if (newOption) {
        resetOptions.push(newOption);
      }
      setInternalOptions(resetOptions);
      setInputValue('');
    },
    [onOptionsSearch, options],
  );

  const handleSelectValue = useCallback(
    (option: T, isActive: boolean, append?: boolean) => {
      handleFinishSelection(append ? option : undefined);

      if (!isMulti) {
        onSelect(option.value, option);
        return;
      }

      if (isActive) {
        const newValues = selectedValues.filter((v) => v !== option.value);
        onSelect(newValues, option);
        return;
      }

      const newValues = [...selectedValues, option.value];

      onSelect(newValues, option);
    },
    [onSelect, selectedValues, handleFinishSelection],
  );

  const handleRemoveOption = useCallback(
    (value: unknown) => {
      onSelect(selectedValues.filter((v) => v !== value));
    },
    [onSelect, selectedValues],
  );

  const handleClearSelection = useCallback(() => {
    onSelect(isMulti ? [] : null);
    setInputValue('');

    if (typeof onClear === 'function') {
      onClear();
    }
  }, [onSelect, onClear]);

  const selectedOptions = useMemo(() => {
    if (!selectedValues.length) {
      return [];
    }

    return internalOptions.filter((option) => selectedValues.includes(option.value));
  }, [selectedValues, internalOptions]);

  const handleTriggerButtonKeydown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setIsDropdownOpen(true);
        break;
      }
      default:
        break;
    }
  }, []);

  const handleDropdownKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!isDropdownOpen) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();

          if (focusedIndex.current < 0 || focusedIndex.current === internalOptions.length - 1) {
            focusedIndex.current = 0;
          } else {
            focusedIndex.current += 1;
          }

          optionsRef.current[focusedIndex.current]?.focus();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();

          if (focusedIndex.current < 0 || focusedIndex.current === 0) {
            focusedIndex.current = internalOptions.length - 1;
          } else {
            focusedIndex.current -= 1;
          }

          optionsRef.current[focusedIndex.current]?.focus();
          break;
        }
        default:
          break;
      }
    },
    [isDropdownOpen, internalOptions],
  );

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('keydown', handleDropdownKeydown);
    }

    return () => {
      focusedIndex.current = -1;
      document.removeEventListener('keydown', handleDropdownKeydown);
    };
  }, [isDropdownOpen, internalOptions]);

  useEffect(() => {
    setInternalOptions(options);
  }, [options]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleSearch(event);
    },
    [options],
  );

  const handleClickAddItem = async () => {
    setIsDropdownOpen(false);
    const value = inputRef?.current?.value ?? '';

    const createdOption = await onCreateOption?.(value);

    if (createdOption) {
      handleSelectValue(createdOption, false, true);
    }
  };

  const hasSelectedValues = selectedOptions.length !== 0;
  const shouldShowPlaceholder = !hasSelectedValues || isMulti;
  const shouldShowClearButton = hasSelectedValues && isClearable && !isDisabled;
  const shouldShowSelectedOptionsList = isMulti && hasSelectedValues;
  const displayedValue = shouldShowPlaceholder ? placeholder : selectedOptions[0]?.label;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <FieldLabel>{label}</FieldLabel>}
      <TriggerButton
        ref={inputRef}
        onClick={handleToggleDropdown}
        onClear={handleClearSelection}
        onKeyDown={handleTriggerButtonKeydown}
        onChange={handleSearchChange}
        isActive={isDropdownOpen}
        shouldShowClearButton={shouldShowClearButton}
        isDisabled={isDisabled}
        isLoading={isOptionsLoading}
        displayedValue={displayedValue}
        isSearchable={isSearchable}
      />
      <FieldError error={error} />
      {shouldShowSelectedOptionsList && (
        <div className="flex gap-2.5 flex-wrap">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between gap-1 bg-slate-100 text-sm p-1 pl-2.5 rounded-sm"
            >
              <span>{option.label}</span>
              {!isDisabled && (
                <Button
                  icon={<XIcon size={15} />}
                  variant="ghost"
                  onClick={() => handleRemoveOption(option.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <PopupMenu
        triggerRef={inputRef}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        shouldAdjustToTriggerWidth
        shouldFocusTriggerOnClose={false}
        role="listbox"
      >
        <div className="max-h-62" ref={optionsWrapperRef}>
          {internalOptions.map((option, index) => {
            const isActive = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                ref={(button) => {
                  optionsRef.current[index] = button!;
                }}
                onClick={() => handleSelectValue(option, isActive)}
                className={clsx(
                  'w-full text-left p-2.5 first:rounded-t-lg last:rounded-b-lg hover:bg-slate-100 focus:bg-sky-100',
                  {
                    ['bg-sky-100 hover:bg-sky-50']: isActive,
                  },
                )}
                type="button"
                role="option"
              >
                {option.label}
              </button>
            );
          })}
          {internalOptions.length === 0 && (
            <div className="flex flex-col items-start gap-4 text-slate-800 text-sm p-2.5">
              <div>Options not found</div>
            </div>
          )}
          {typeof onCreateOption === 'function' && (
            <div className="p-2.5 bg-slate-50 rounded-b-xl [&>button]:w-full [&>button]:justify-start">
              <Button variant="ghost" icon={<SaveIcon size={18} />} onClick={handleClickAddItem}>
                Save value
              </Button>
            </div>
          )}
        </div>
      </PopupMenu>
    </div>
  );
};
