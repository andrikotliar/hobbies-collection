import { UpdateUserPasswordInputSchema } from '@hobbies-collection/shared';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import {
  Form,
  getUserDataQueryOptions,
  Panel,
  queryKey,
  SectionTitle,
  toaster,
  api,
  type Input,
} from '~/shared';

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
      <Form schema={UserFormSchema} onSubmit={mutateAsync} isLoading={isPending}>
        <SectionTitle>Password</SectionTitle>
        <Form.PasswordInput label="Actual password" name="actualPassword" />
        <Form.PasswordInput label="New password" name="newPassword" />
      </Form>
    </Panel>
  );
}
