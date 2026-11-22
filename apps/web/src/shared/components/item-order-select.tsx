import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { FieldError } from '~/shared/components/field-error';
import { AppForm } from '~/shared/components/app-form';
import { Loader } from '~/shared/components/loader';
import type { MixedId } from '~/shared/types/mixed-id';

export type DataParams = {
  imagePath: string | null;
  id: number;
  order: number | null;
};

export type ItemOrderSelectProps<T extends DataParams> = {
  name: string;
  queryOptions: UseQueryOptions<T[] | undefined, Error, T[] | undefined, any>;
  currentItemId: MixedId;
};

export const ItemOrderSelect = <T extends DataParams>({
  name,
  queryOptions,
  currentItemId,
}: ItemOrderSelectProps<T>) => {
  const { data, isLoading } = useQuery(queryOptions);

  if (isLoading) {
    return <Loader size={25} />;
  }

  if (!data) {
    return <FieldError error="Selected collection doesn't have films" />;
  }

  return <AppForm.OrderSelect name={name} list={data} currentId={currentItemId} />;
};
