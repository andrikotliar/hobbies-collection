import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import styles from './styles.module.css';
import { useState } from 'react';
import { LaptopMinimalIcon, RadioIcon, SmartphoneIcon, TabletIcon } from 'lucide-react';
import type { ApiResponse } from '~/shared/types/extract-params';
import { api, queryKey } from '~/shared/services/api';
import { getUserSessionsQueryOptions } from '~/shared/helpers/query-options/users/get-user-sessions';
import { Panel } from '~/shared/components/panel/panel';
import { getLastActivity } from '~/shared/helpers/get-last-activity';
import { Button } from '~/shared/components/button';
import { ConfirmModal } from '~/shared/components/confirm-modal';

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
          <div className={styles.session} key={session.id}>
            <div>
              <div className={styles.device}>
                <div className={styles.icons}>
                  <div>{getDeviceIcon(session.deviceInfo)} </div>
                  {session.isCurrent && (
                    <div title="Current session">
                      <RadioIcon className={styles.live_device} />
                    </div>
                  )}
                </div>
                <div>
                  {session.deviceInfo?.device?.vendor ? (
                    <div className={styles.device_title}>
                      {session.deviceInfo.device.vendor} {session.deviceInfo.device.model}
                    </div>
                  ) : (
                    <div className={styles.device_title}>Unknown device</div>
                  )}
                  {session.deviceInfo?.browser?.name && (
                    <div className={styles.additional_info}>
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
              <div className={styles.time}>{getLastActivity(session.lastActivityAt)}</div>
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
