import { ConsoleHeader } from './console-header';
import { Outlet } from '@tanstack/react-router';

export const ConsoleRootLayout = () => {
  return (
    <div className="flex flex-col max-w-6xl w-full mx-auto">
      <ConsoleHeader />
      <div className="px-5 pt-0.5 pb-5 flex flex-col gap-5">
        <Outlet />
      </div>
    </div>
  );
};
