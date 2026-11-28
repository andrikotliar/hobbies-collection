import { useFormContext } from 'react-hook-form';
import type z from 'zod';
import { Button } from '~/shared/components/controls/button';
import { AppForm } from '~/shared/components/form/app-form';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';
import { toaster } from '~/shared/utils/toaster';

type Props = {
  label: string;
  name: 'budget' | 'boxOffice';
};

export const MoneyInput = ({ name, label }: Props) => {
  const { setValue, getValues } = useFormContext<z.infer<typeof FilmFormSchema>>();

  const handleMultiplier = (multiplier: number) => {
    const values = getValues();

    const plainValue = values[name];

    if (!plainValue) {
      toaster.error('Value should be larger than 0');
      return;
    }

    if (plainValue >= 1000) {
      toaster.error('Value should be less than 1000');
      return;
    }

    if (plainValue > multiplier) {
      toaster.warning('Value is larger than multiplier. Skipping');
      return;
    }

    setValue(name, plainValue * multiplier);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <AppForm.TextInput type="number" name={name} label={label} min="0" />
      <div className="flex gap-2.5">
        <Button variant="light" onClick={() => handleMultiplier(1_000_000)}>
          × 1 million
        </Button>
        <Button variant="light" onClick={() => handleMultiplier(1_000_000_000)}>
          × 1 billion
        </Button>
      </div>
    </div>
  );
};
