import styles from './styles.module.css';
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldLabel } from '~/shared/components/field-label/field-label';
import { PopupMenu } from '~/shared/components/popup-menu/popup-menu';
import { FieldError } from '~/shared/components/field-error/field-error';
import { getSelectValue } from './helpers/get-select-value';
import type { ListOption } from '@hobbies-collection/shared';
import type { FormError } from '~/shared/types/form-error';
import { useDebouncedSearch } from '~/shared/hooks/use-debounced-search';
import { TriggerButton } from './components/trigger-button/trigger-button';
import { SelectedOption } from './components/selected-option/selected-option';
import { NotFound } from './components/not-found/not-found';
import { CreateNewItemButton } from './components/create-new-item-button/create-new-item-button';
import { Option } from './components/option/option';

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
    <div className={styles.select_wrapper}>
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
        <div className={styles.selected}>
          {selectedOptions.map((option) => (
            <SelectedOption
              data={option}
              onRemove={handleRemoveOption}
              key={option.value}
              isDisabled={isDisabled}
            />
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
        <div className={styles.dropdown_container} ref={optionsWrapperRef}>
          {internalOptions.map((option, index) => (
            <Option
              key={option.value}
              data={option}
              onSelect={handleSelectValue}
              selectedValues={selectedValues}
              ref={(button) => {
                optionsRef.current[index] = button!;
              }}
            />
          ))}
          {internalOptions.length === 0 && <NotFound />}
          {typeof onCreateOption === 'function' && (
            <CreateNewItemButton onCreate={handleClickAddItem} />
          )}
        </div>
      </PopupMenu>
    </div>
  );
};
