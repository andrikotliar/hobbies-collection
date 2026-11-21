import { NominationsForm } from '~/routes/console/awards_/-components/nominations-form/nominations-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { Input } from '~/shared/types/extract-params';
import { api, queryKey } from '~/shared/services/api';
import { mutateEntity } from '~/shared/helpers/mutate-entity';
import { AppForm } from '~/shared/components/app-form';
import { Panel } from '~/shared/components/panel/panel';
import { AwardFormSchema } from '~/shared/schemas/award-form.schema';

type Props = {
  values: Input<typeof api.awards.create>;
};

export const AwardForm = ({ values }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateEntity(api.awards.create, api.awards.update),
    onSuccess: () => {
      navigate({
        to: '/console/awards',
      });
    },
    meta: {
      invalidateQueries: [
        {
          queryKey: queryKey('awards.getById'),
        },
        {
          queryKey: queryKey('awards.getList'),
        },
        {
          queryKey: queryKey('initialData.get'),
        },
      ],
    },
  });

  return (
    <AppForm
      onSubmit={mutateAsync}
      defaultValues={values}
      schema={AwardFormSchema}
      isLoading={isPending}
      islandActions
    >
      <Panel isFlexContainer>
        <AppForm.TextInput name="title" label="Title" />
        <AppForm.TextArea name="description" label="Description" />
        <NominationsForm />
      </Panel>
    </AppForm>
  );
};
