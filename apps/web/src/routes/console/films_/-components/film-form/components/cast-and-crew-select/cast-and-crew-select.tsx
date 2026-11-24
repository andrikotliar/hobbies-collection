import { useFieldArray, useFormContext } from 'react-hook-form';
import type { Enum, ListOption, PersonRole } from '@hobbies-collection/shared';
import type z from 'zod';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';
import { AppForm } from '~/shared/components/form/app-form';
import { PeopleSelect } from '../cast-and-crew-select/components/people-select/people-select';

type Props = {
  positionOptions: ListOption<string>[];
};

const rolesNextSelect: Record<Enum<typeof PersonRole>, Enum<typeof PersonRole>> = {
  CREATOR: 'ACTOR',
  DIRECTOR: 'WRITER',
  WRITER: 'PRODUCER',
  PRODUCER: 'COMPOSER',
  COMPOSER: 'CAMERAMAN',
  CAMERAMAN: 'ACTOR',
  ACTOR: 'DIRECTOR',
};

export const CastAndCrewSelect = ({ positionOptions }: Props) => {
  const { control } = useFormContext<z.infer<typeof FilmFormSchema>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'castAndCrew',
  });

  const handleAddNewPerson = () => {
    const prevField = fields.at(-1);
    const nextRole = prevField ? rolesNextSelect[prevField.role] : 'DIRECTOR';
    append(
      {
        role: nextRole,
        people: [
          {
            personId: -1,
            details: null,
          },
        ],
      },
      { shouldFocus: false },
    );
  };

  return (
    <AppForm.Section label="Cast and Crew">
      <AppForm.ArrayWrapper onCreate={handleAddNewPerson} createButtonLabel="Add role">
        {fields.map((field, index) => (
          <AppForm.ArrayFieldWrapper onRemove={() => remove(index)} key={field.id}>
            <AppForm.Select
              name={`castAndCrew.${index}.role`}
              options={positionOptions}
              isSearchable={false}
              label="Role"
            />
            <PeopleSelect index={index} />
          </AppForm.ArrayFieldWrapper>
        ))}
      </AppForm.ArrayWrapper>
    </AppForm.Section>
  );
};
