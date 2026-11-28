import type { ListOption } from '@hobbies-collection/shared';
import { useMutation } from '@tanstack/react-query';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type z from 'zod';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';
import { AppForm } from '~/shared/components/form/app-form';
import { api, queryKey } from '~/shared/services/api';
import { Button } from '~/shared/components/controls/button';
import { FieldError } from '~/shared/components/ui/field-error';

type Props = {
  index: number;
};

export const PeopleSelect = ({ index }: Props) => {
  const { control, watch, formState } = useFormContext<z.infer<typeof FilmFormSchema>>();

  const values = watch('castAndCrew');

  const { append, remove, fields } = useFieldArray({
    control,
    name: `castAndCrew.${index}.people`,
  });

  const { mutateAsync, isPending, variables } = useMutation({
    mutationFn: async ({
      value,
    }: {
      value: string;
      index: number;
    }): Promise<ListOption<number>> => {
      if (!value.length) {
        throw new Error('Name cannot be empty');
      }
      const result = await api.people.create({
        input: {
          name: value,
        },
      });

      return {
        value: result.id,
        label: result.name,
      };
    },
  });

  return (
    <div className="flex flex-col items-start gap-4">
      {fields.map((field, personIndex) => (
        <div key={field.id} className="w-full">
          <div className="flex items-start gap-2.5 bg-slate-100 p-2.5 rounded-sm">
            <div className="flex gap-4 flex-col grow">
              <AppForm.AsyncSelect
                name={`castAndCrew.${index}.people.${personIndex}.personId`}
                label="Person"
                optionsLoader={api.people.search}
                onCreateOption={(value) => mutateAsync({ value, index: personIndex })}
                isOptionsLoading={isPending && variables.index === personIndex}
                queryKeyParams={{
                  key: queryKey('people.search')[0],
                  values: values[index]?.people[personIndex]?.personId,
                }}
              />
              {values[index].role === 'ACTOR' && (
                <AppForm.TextInput
                  name={`castAndCrew.${index}.people.${personIndex}.details`}
                  label="Details"
                />
              )}
            </div>
            <Button icon={<TrashIcon />} variant="ghost" onClick={() => remove(personIndex)} />
          </div>
          <FieldError
            error={formState.errors.castAndCrew?.[index]?.people?.[personIndex]?.personId?.message}
          />
        </div>
      ))}
      <Button
        variant="ghost"
        icon={<PlusIcon />}
        onClick={() =>
          append({
            personId: 0,
            details: null,
          })
        }
      >
        Add person
      </Button>
    </div>
  );
};
