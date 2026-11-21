import styles from './styles.module.css';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import type { Input } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { AppForm } from '~/shared/components/app-form';
import { Button } from '~/shared/components/button';
import { ConfirmModal } from '~/shared/components/confirm-modal/confirm-modal';

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
      <div className={styles.nominations_form}>
        {fields.map((_, index) => (
          <div className={styles.nomination} key={index}>
            <div className={styles.nomination_title}>
              <AppForm.TextInput name={`nominations.${index}.title`} label="Nomination title" />
            </div>
            <div className={styles.nomination_toggle}>
              <AppForm.Toggle
                title="Should include actor"
                name={`nominations.${index}.shouldIncludeActor`}
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
