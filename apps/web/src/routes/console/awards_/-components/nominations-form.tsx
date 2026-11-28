import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import type { Input } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { AppForm } from '~/shared/components/form/app-form';
import { Button } from '~/shared/components/controls/button';
import { ConfirmModal } from '~/shared/components/modals/confirm-modal';

const nominationDefaultValues = {
  id: -1,
  title: '',
  shouldIncludeActor: false,
};

export const NominationsForm = () => {
  const [nominationIndex, setNominationIndex] = useState<number | null>(null);

  const { control } = useFormContext<Input<typeof api.awards.create>>();

  const { fields, append, remove } = useFieldArray({
    name: 'nominations',
    control,
  });

  return (
    <AppForm.Section label="Nominations">
      <div className="flex flex-col gap-10 md:gap-5">
        {fields.map((_, index) => (
          <div
            className="flex flex-col md:flex-row gap-2.5 md:gap-5 items-start md:items-center"
            key={index}
          >
            <div className="w-full">
              <AppForm.TextInput name={`nominations.${index}.title`} label="Nomination title" />
            </div>
            <div className="flex gap-5 mt-0 md:mt-5 justify-between md:justify-stretch w-full md:w-auto">
              <AppForm.Checkbox
                label="Should include actor"
                name={`nominations.${index}.shouldIncludeActor`}
                type="checkbox"
              />
              <Button
                variant="ghost"
                icon={<Trash2Icon />}
                onClick={() => setNominationIndex(index)}
              />
            </div>
          </div>
        ))}
        <div>
          <Button
            variant="ghost"
            icon={<PlusIcon />}
            onClick={() => append(nominationDefaultValues)}
          >
            Add nomination
          </Button>
        </div>
        <ConfirmModal
          title={`Delete ${fields[nominationIndex ?? 0]?.title}?`}
          data={nominationIndex}
          onClose={() => setNominationIndex(null)}
          onConfirm={(index) => {
            remove(index);
            setNominationIndex(null);
          }}
        />
      </div>
    </AppForm.Section>
  );
};
