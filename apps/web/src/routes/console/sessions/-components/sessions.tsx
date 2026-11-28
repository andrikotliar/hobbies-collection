import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LaptopMinimalIcon, RadioIcon, SmartphoneIcon, TabletIcon } from 'lucide-react';
import type { ApiResponse } from '~/shared/types/extract-params';
import { api, queryKey } from '~/shared/services/api';
import { getUserSessionsQueryOptions } from '~/shared/helpers/query-options/users/get-user-sessions';
import { Panel } from '~/shared/components/ui/panel';
import { getLastActivity } from '~/shared/helpers/get-last-activity';
import { Button } from '~/shared/components/controls/button';
import { ConfirmModal } from '~/shared/components/modals/confirm-modal';

const deviceTypeToIcon = {
  mobile: <SmartphoneIcon />,
  table: <TabletIcon />,
};

const getDeviceIcon = (data: ApiResponse<typeof api.users.getSessions>[number]['deviceInfo']) => {
  if (!data?.device?.type) {
    return <LaptopMinimalIcon />;
  }

  const icon = deviceTypeToIcon[data.device.type as keyof typeof deviceTypeToIcon];

  if (!icon) {
    return <LaptopMinimalIcon />;
  }

  return icon;
};

export const Sessions = () => {
  const { data } = useSuspenseQuery(getUserSessionsQueryOptions());

  const [selectedSession, setSelectedSession] = useState<
    ApiResponse<typeof api.users.getSessions>[number] | null
  >(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: number) => {
      await api.users.terminateSession({ params: { id } });
    },
    meta: {
      invalidateQueries: {
        queryKey: queryKey('users.getSessions'),
      },
    },
  });

  return (
    <>
      <Panel isFlexContainer>
        {data.map((session) => (
          <div
            className="flex gap-5 w-full justify-between pb-5 border-b border-b-slate-300 flex-wrap last:pb-0 last:border-b-0"
            key={session.id}
          >
            <div>
              <div className="flex flex-col gap-1 xs:flex-row xs:gap-2.5 items-start">
                <div className="flex gap-1">
                  <div>{getDeviceIcon(session.deviceInfo)} </div>
                  {session.isCurrent && (
                    <div title="Current session">
                      <RadioIcon className="text-teal-500" />
                    </div>
                  )}
                </div>
                <div>
                  {session.deviceInfo?.device?.vendor ? (
                    <div className="font-bold">
                      {session.deviceInfo.device.vendor} {session.deviceInfo.device.model}
                    </div>
                  ) : (
                    <div className="font-bold">Unknown device</div>
                  )}
                  {session.deviceInfo?.browser?.name && (
                    <div className="text-sm mt-0.5">
                      <span>
                        {session.deviceInfo.browser.name} {session.deviceInfo.browser.version}
                      </span>
                      {session.deviceInfo.os.name && (
                        <span>
                          {' '}
                          / {session.deviceInfo.os.name} {session.deviceInfo.os.version}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-slate-600 text-sm mt-2.5">
                {getLastActivity(session.lastActivityAt)}
              </div>
            </div>
            <div>
              {!session.isCurrent && (
                <Button size="small" onClick={() => setSelectedSession(session)}>
                  Terminate session
                </Button>
              )}
            </div>
          </div>
        ))}
      </Panel>
      <ConfirmModal
        title="Terminate session?"
        data={selectedSession}
        onClose={() => setSelectedSession(null)}
        onConfirm={async (session) => {
          await mutateAsync(session.id);
          setSelectedSession(null);
        }}
        isPending={isPending}
      />
    </>
  );
};
