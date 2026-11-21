import { UpdateUserPasswordInputSchema } from '@hobbies-collection/shared';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { AppForm } from '~/shared/components/app-form';
import { Panel } from '~/shared/components/panel/panel';
import { SectionTitle } from '~/shared/components/section-title/section-title';
import { getUserDataQueryOptions } from '~/shared/helpers/query-options/users/get-user-data-query-options';
import { api, queryKey } from '~/shared/services/api';
import type { Input } from '~/shared/types/extract-params';
import { toaster } from '~/shared/utils/toaster';

const UserFormSchema = z
  .object({
    actualPassword: z.string(),
    newPassword: z.string(),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (data.actualPassword || data.newPassword) {
      const result = UpdateUserPasswordInputSchema.safeParse(data);

      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue(issue as any);
        }
      }
    }
  });

type UserFormValues = z.infer<typeof UserFormSchema>;

export const Route = createFileRoute('/console/user')({
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getUserDataQueryOptions());
  },
  staticData: {
    title: 'User',
    backPath: '/console',
  },
  head: () => ({
    meta: [
      {
        title: 'User - Films Collection',
      },
    ],
  }),
});

function RouteComponent() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: UserFormValues) => {
      const input: Input<typeof api.users.update> = {};

      const { actualPassword, newPassword } = values;

      if (actualPassword && newPassword) {
        input.password = {
          actualPassword,
          newPassword,
        };
      }

      return api.users.update({
        input,
      });
    },
    onSuccess: () => {
      toaster.success('Password successfully updated');
    },
    meta: {
      invalidateQueries: {
        queryKey: queryKey('users.getUser'),
      },
    },
  });

  return (
    <Panel>
      <AppForm schema={UserFormSchema} onSubmit={mutateAsync} isLoading={isPending}>
        <SectionTitle>Password</SectionTitle>
        <AppForm.PasswordInput label="Actual password" name="actualPassword" />
        <AppForm.PasswordInput label="New password" name="newPassword" />
      </AppForm>
    </Panel>
  );
}
