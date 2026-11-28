import { type DragEndEvent } from '@dnd-kit/core';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type z from 'zod';
import { AppForm } from '~/shared/components/form/app-form';
import { SortableList } from '~/shared/components/layout/sortable-list';
import type { FilmFormSchema } from '~/shared/schemas/film-form.schema';

export const TrailersSelect = () => {
  const { control, watch, formState } = useFormContext<z.infer<typeof FilmFormSchema>>();

  const {
    fields: trailers,
    append: appendTrailers,
    move: resortTrailers,
    remove: removeTrailer,
  } = useFieldArray({ control, name: 'trailers' });

  const type = watch('type');

  const trailerLabel = type?.includes('SERIES') ? 'Season' : 'Trailer #';

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = trailers.findIndex((field) => field.id === active.id);
    const newIndex = trailers.findIndex((field) => field.id === over.id);

    resortTrailers(oldIndex, newIndex);
  };

  const handleAddNewTrailer = () => {
    appendTrailers({
      url: '',
      order: trailers.length + 1,
    });
  };

  return (
    <AppForm.Section label={`Trailers (${trailers.length})`}>
      <AppForm.ArrayWrapper onCreate={handleAddNewTrailer} createButtonLabel="Add trailer">
        <SortableList items={trailers} onDragEnd={handleDragEnd}>
          {trailers.map((trailer, index) => (
            <SortableList.Item id={trailer.id} key={trailer.id}>
              <AppForm.VideoInput
                name={`trailers.${index}.url`}
                label={`${trailerLabel} ${index + 1}`}
                onRemove={() => removeTrailer(index)}
                error={formState.errors?.trailers?.[index]?.url?.message}
              />
            </SortableList.Item>
          ))}
        </SortableList>
      </AppForm.ArrayWrapper>
    </AppForm.Section>
  );
};
