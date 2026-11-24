import type z from 'zod';
import type { FilmDraftResponse } from '@hobbies-collection/shared';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getInitialDataQueryOptions } from '~/shared/helpers/query-options/initial-data/get-initial-data-query-options';
import { uploadImage } from '~/shared/helpers/upload-image';
import { isNewItem } from '~/shared/helpers/is-new-item';
import { getObjectsDiff } from '~/shared/helpers/get-objects-diff';
import { api, queryKey } from '~/shared/services/api';
import { AppForm } from '~/shared/components/form/app-form';
import { Panel } from '~/shared/components/ui/panel';
import { Drafts } from './components/drafts/drafts';
import { TrailersSelect } from './components/trailers-select/trailers-select';
import { SeriesExtension } from './components/series-extension/series-extension';
import { MoneyInput } from './components/money-input/money-input';
import { AwardsSelect } from './components/awards-select/awards-select';
import { CastAndCrewSelect } from './components/cast-and-crew-select/cast-and-crew-select';
import { FilmValuesWatcher } from './components/film-values-watcher/film-values-watcher';
import { FilmFormSchema } from '~/shared/schemas/film-form.schema';

type Props = {
  values: z.infer<typeof FilmFormSchema>;
};

type CreateNewEntityInput = {
  value: string;
  type: 'genres' | 'countries' | 'studios' | 'collections';
};

export const FilmForm = ({ values }: Props) => {
  const { data: initialOptions } = useSuspenseQuery(getInitialDataQueryOptions());
  const [selectedDraft, setSelectedDraft] = useState<FilmDraftResponse | null>(null);
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/console/films_/$id' });

  const { isPending, mutateAsync: handleSubmit } = useMutation({
    mutationFn: async (data: z.infer<typeof FilmFormSchema>) => {
      const imagePath = await uploadImage({
        image: data.imagePath,
        title: data.title,
        folder: 'posters',
      });

      const today = Date.now();
      const releaseDateMs = data.releaseDate ? new Date(data.releaseDate).getTime() : 0;

      const isDraft = releaseDateMs > today || data.draft;

      const input = {
        ...data,
        imagePath,
        draft: isDraft,
      };

      if (!isNewItem(values.id)) {
        const diff = getObjectsDiff(values, input);

        if (!diff) {
          return;
        }

        return await api.films.update({
          params: { id: values.id },
          input: diff,
        });
      }

      return await api.films.create({
        input: {
          ...input,
          tempDraftId: selectedDraft?.id,
        },
      });
    },
    onSuccess: () => {
      navigate({ to: '/console/films', search: searchParams });
      window.scrollTo(0, 0);
    },
    meta: {
      invalidateQueries: [
        {
          queryKey: queryKey('films.getAdminList'),
        },
        ...(!isNewItem(values.id)
          ? [
              {
                queryKey: queryKey('films.getById', values.id),
              },
              {
                queryKey: queryKey('films.getEditableFilm', values.id),
              },
            ]
          : []),
      ],
    },
  });

  const { mutateAsync: createNewEntity } = useMutation({
    mutationFn: async ({ value, type }: CreateNewEntityInput) => {
      switch (type) {
        case 'genres': {
          const result = await api.genres.create({ input: { title: value } });
          return {
            value: result.id,
            label: result.title,
          };
        }
        case 'countries': {
          const result = await api.countries.create({ input: { title: value } });
          return {
            value: result.id,
            label: result.title,
          };
        }
        case 'studios': {
          const result = await api.studios.create({ input: { title: value } });
          return {
            value: result.id,
            label: result.title,
          };
        }
        case 'collections': {
          const result = await api.collections.create({ input: { title: value, films: [] } });
          return {
            value: result.id,
            label: result.title,
          };
        }
        default:
          throw new Error('Unknown type');
      }
    },
    meta: {
      invalidateQueries: { queryKey: queryKey('initialData.get') },
    },
  });

  return (
    <AppForm
      onSubmit={handleSubmit}
      defaultValues={values}
      schema={FilmFormSchema}
      onReset={(reset) => {
        reset(values);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      isLoading={isPending}
      islandActions
    >
      <Drafts selectedDraft={selectedDraft} onSelectDraft={setSelectedDraft} />
      <Panel isFlexContainer>
        <AppForm.TextInput name="title" label="Title" />
        <AppForm.CheckboxesGroup
          label="Type"
          name="type"
          options={initialOptions.options.types}
          type="radio"
        />
        <AppForm.RatingInput name="rating" label="Rating" size={3} />
        <AppForm.FileInput label="Poster" name="imagePath" />
        <TrailersSelect />
        <SeriesExtension />
        <AppForm.Select
          label="Genres"
          name="genres"
          options={initialOptions.options.genres}
          isMulti
          onCreateOption={(value) => createNewEntity({ value, type: 'genres' })}
        />
        <AppForm.Select
          label="Countries"
          name="countries"
          options={initialOptions.options.countries}
          onCreateOption={(value) => createNewEntity({ value, type: 'countries' })}
          isMulti
        />
        <AppForm.Select
          label="Studios"
          name="studios"
          options={initialOptions.options.studios}
          onCreateOption={(value) => createNewEntity({ value, type: 'studios' })}
          isMulti
        />
        <AppForm.Select
          label="Collections"
          name="collections"
          options={initialOptions.options.collections}
          onCreateOption={(value) => createNewEntity({ value, type: 'collections' })}
          isMulti
        />
        <AppForm.DatePicker name="releaseDate" label="Release Date" />
        <AppForm.TextInput name="duration" type="number" label="Runtime (min)" min="0" />
        <MoneyInput name="budget" label="Budget" />
        <MoneyInput name="boxOffice" label="Box Office" />
        <AwardsSelect awardOptions={initialOptions.options.awards} />
        <CastAndCrewSelect positionOptions={initialOptions.options.roles} />
        <AppForm.Checkbox name="draft" label="Draft" type="checkbox" />
      </Panel>
      <FilmValuesWatcher
        selectedDraft={selectedDraft}
        onDraftCreated={setSelectedDraft}
        formDefaultValues={values}
      />
    </AppForm>
  );
};
