import { AppForm } from '~/shared/components/form/app-form';
import type { FilterItem } from '~/shared/types/filter';

type FilterOptionsProps<T extends Record<string, any>> = {
  filter: FilterItem<T>;
};

export const FilterOptions = <T extends Record<string, any>>({ filter }: FilterOptionsProps<T>) => {
  switch (filter.type) {
    case 'checkmark':
      return (
        <AppForm.Group title={filter.title}>
          {filter.options.map((option) => (
            <AppForm.Checkbox
              type={filter.inputType}
              label={option.label}
              value={option.value}
              name={filter.id}
              key={option.value}
            />
          ))}
        </AppForm.Group>
      );

    case 'daterange':
      return <AppForm.DateRange title={filter.title} inputs={filter.inputs} />;

    case 'boolean':
      return (
        <AppForm.Group title={filter.title}>
          {filter.options.map((option) => (
            <AppForm.Checkbox
              type="checkbox"
              label={option.label}
              name={option.id}
              key={option.id}
            />
          ))}
        </AppForm.Group>
      );

    case 'rating':
      return (
        <AppForm.Group title={filter.title}>
          <AppForm.RatingInput name={filter.id} size={filter.size} />
        </AppForm.Group>
      );

    case 'number':
      return (
        <AppForm.Group title={filter.title}>
          <AppForm.TextInput name={filter.id} type="number" min={filter.min} max={filter.max} />
        </AppForm.Group>
      );

    case 'combo-select':
      return <AppForm.ComboSelect filter={filter} />;

    case 'select':
      return (
        <AppForm.Group title={filter.title}>
          <AppForm.Select options={filter.options} name={filter.id} />
        </AppForm.Group>
      );

    case 'range':
      return (
        <AppForm.Group title={filter.title}>
          <AppForm.RangeInput name={filter.id} {...filter} />
        </AppForm.Group>
      );

    default:
      return null;
  }
};
