import { Form, type FilterItem } from '~/shared';
import { ComboSelect } from '../combo-select/combo-select';

type FilterOptionsProps<T extends Record<string, any>> = {
  filter: FilterItem<T>;
};

export const FilterOptions = <T extends Record<string, any>>({ filter }: FilterOptionsProps<T>) => {
  switch (filter.type) {
    case 'checkmark':
      return (
        <Form.Group title={filter.title}>
          {filter.options.map((option) => (
            <Form.Checkbox
              type={filter.inputType}
              label={option.label}
              value={option.value}
              name={filter.id}
              key={option.value}
            />
          ))}
        </Form.Group>
      );

    case 'daterange':
      return <Form.DateRange title={filter.title} inputs={filter.inputs} />;

    case 'boolean':
      return (
        <Form.Group title={filter.title}>
          {filter.options.map((option) => (
            <Form.Checkbox type="checkbox" label={option.label} name={option.id} key={option.id} />
          ))}
        </Form.Group>
      );

    case 'rating':
      return (
        <Form.Group title={filter.title}>
          <Form.RatingInput name={filter.id} size={filter.size} />
        </Form.Group>
      );

    case 'number':
      return (
        <Form.Group title={filter.title}>
          <Form.TextInput name={filter.id} type="number" min={filter.min} max={filter.max} />
        </Form.Group>
      );

    case 'combo-select':
      return <ComboSelect filter={filter} />;

    case 'select':
      return (
        <Form.Group title={filter.title}>
          <Form.Select options={filter.options} name={filter.id} />
        </Form.Group>
      );

    case 'range':
      return (
        <Form.Group title={filter.title}>
          <Form.RangeInput name={filter.id} {...filter} />
        </Form.Group>
      );

    default:
      return null;
  }
};
