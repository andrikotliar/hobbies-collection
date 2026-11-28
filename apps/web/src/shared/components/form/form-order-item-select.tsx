import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { FieldError } from '~/shared/components/ui/field-error';
import { FormOrderSelect } from '~/shared/components/form/form-order-select';
import { Loader } from '~/shared/components/ui/loader';
import type { MixedId } from '~/shared/types/mixed-id';

export type DataParams = {
  imagePath: string | null;
  id: number;
  order: number | null;
};

export type OrderItemQueryOptions<T extends DataParams> = UseQueryOptions<
  T[] | undefined,
  Error,
  T[] | undefined,
  any
>;

export type Props<T extends DataParams> = {
  name: string;
  queryOptions: OrderItemQueryOptions<T>;
  currentItemId: MixedId;
};

export const FormOrderItemSelect = <T extends DataParams>({
  name,
  queryOptions,
  currentItemId,
}: Props<T>) => {
  const { data, isLoading } = useQuery(queryOptions);

  if (isLoading) {
    return <Loader size={25} />;
  }

  if (!data) {
    return <FieldError error="Selected collection doesn't have films" />;
  }

  return <FormOrderSelect name={name} list={data} currentId={currentItemId} />;
};
