import { useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { mutationOptions, useQuery } from '@tanstack/react-query';
import { CommonListQuerySchema } from '@hobbies-collection/shared';
import { getDefaultDateCode } from '~/shared/helpers/get-default-date-code';
import { getEmptyFormValues } from '~/shared/helpers/get-empty-form-values';
import { withFormModal } from '~/shared/helpers/with-form-modal';
import { CollectionEventForm } from './-components/collection-event-form/collection-event-form';
import { getCollectionEventsQueryOptions } from '~/shared/helpers/query-options/collection-events/get-collection-events-query-options';
import { api, queryKey } from '~/shared/services/api';
import { useFormModal } from '~/shared/context/form-modal-context';
import type { FormModalValues } from '~/shared/helpers/form-modal-values';
import { ConsolePageList } from '~/shared/components/console-page-list/console-page-list';
import { getDateMonthLabel } from '~/shared/helpers/get-date-month-label';

const getCollectionEventDefaultValues = () => {
  const defaultDateCode = getDefaultDateCode();

  return getEmptyFormValues({
    title: '',
    collectionId: 0,
    startDateCode: defaultDateCode,
    endDateCode: defaultDateCode + 1,
    yearFrom: 0,
    isOneDayEvent: false,
    titleFilmId: 0,
  });
};

export const Route = createFileRoute('/console/collection-events')({
  validateSearch: (search) => CommonListQuerySchema.parse(search),
  component: withFormModal(CollectionEventForm, CollectionEventsContainer),
  loader: ({ context, location }) => {
    return context.queryClient.ensureQueryData(getCollectionEventsQueryOptions(location.search));
  },
  staticData: {
    title: 'Collections Events',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'Collection Events - Films Collection',
      },
    ],
  }),
});

const getDeleteMutationOptions = () => {
  return mutationOptions({
    mutationFn: (id: number) => {
      return api.collectionEvents.delete({ params: { id } });
    },
    meta: {
      invalidateQueries: [
        {
          queryKey: queryKey('collectionEvents.getList'),
        },
        { queryKey: queryKey('initialData.get') },
      ],
    },
  });
};

function CollectionEventsContainer() {
  const { onOpen } = useFormModal<FormModalValues<typeof CollectionEventForm>>();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isFetching } = useQuery(getCollectionEventsQueryOptions(search));

  const handlePageChange = (index: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageIndex: index,
      }),
    });
  };

  const handleSearch = useCallback((value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        q: value,
        pageIndex: 0,
      }),
    });
  }, []);

  return (
    <ConsolePageList
      data={data}
      getDeleteMutationOptions={getDeleteMutationOptions}
      onEdit={(values) =>
        onOpen({
          ...values,
          collectionId: values.collectionId,
          titleFilmId: values.titleFilmId ?? 0,
          isOneDayEvent: values.startDateCode === values.endDateCode,
        })
      }
      description={getDateMonthLabel}
      isFetching={isFetching}
      onCreate={() => onOpen(getCollectionEventDefaultValues())}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
    />
  );
}
