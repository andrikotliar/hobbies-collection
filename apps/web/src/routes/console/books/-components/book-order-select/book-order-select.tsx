import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import type z from 'zod';
import type { BookFormSchema } from '~/routes/console/books/-configs';
import {
  api,
  buildGetBookSeriesQueryOptions,
  Form,
  Loader,
  queryKey,
  type MixedId,
} from '~/shared';

type BookOrderSelectProps = {
  currentId: MixedId;
  value: number | undefined | null;
};

export const BookOrderSelect = ({ currentId, value }: BookOrderSelectProps) => {
  const { watch } = useFormContext<z.infer<typeof BookFormSchema>>();

  const firstBookId = watch('firstBookId');

  const { data: series = [], isLoading } = useQuery(buildGetBookSeriesQueryOptions(firstBookId));

  return (
    <>
      <Form.AsyncSelect
        name="firstBookId"
        label="First book"
        optionsLoader={api.books.search}
        queryKeyParams={{ key: queryKey('books.search')[0], values: value }}
      />
      {isLoading && <Loader size={20} />}
      {firstBookId && !isLoading && (
        <Form.OrderSelect name="seriesOrder" currentId={currentId} list={series} />
      )}
    </>
  );
};
