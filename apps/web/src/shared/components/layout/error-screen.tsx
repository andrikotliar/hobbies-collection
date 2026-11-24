import { HttpError } from '@hobbies-collection/contracts';
import { onlineManager } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { HomeIcon, RefreshCcwIcon } from 'lucide-react';
import { Button } from '~/shared/components/controls/button';
import { AppImage } from '~/shared/components/ui/app-image';
import { imagePaths } from '~/shared/configs/image-paths';

type Props = {
  error: unknown;
};

const Status = ({
  title,
  message,
  imageSrc,
  isRecoverable = false,
}: {
  title: string;
  message: string;
  imageSrc: string;
  isRecoverable?: boolean;
}) => {
  return (
    <div className="flex items-center justify-center h-screen p-5 w-full">
      <div className="max-w-124">
        <AppImage src={imageSrc} className="max-h-75" />
        <h1 className="text-5xl font-stretch-ultra-condensed uppercase mt-5">{title}</h1>
        <p className="text-gray-600 mt-2.5 mb-5">{message}</p>
        {isRecoverable ? (
          <Button icon={<RefreshCcwIcon />} onClick={() => window.location.reload()}>
            Reload
          </Button>
        ) : (
          <Link
            to="/"
            className="text-white inline-flex items-center py-2.5 px-5 gap-2.5 bg-sky-600 rounded-lg border border-transparent hover:border-black"
            replace
          >
            <HomeIcon />
            <span>Return to Home</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export const ErrorScreen = ({ error }: Props) => {
  if (!onlineManager.isOnline()) {
    return (
      <Status
        title="No internet connection"
        message="Fix a connection issue and reload the page"
        imageSrc={imagePaths.errors.noInternetError}
        isRecoverable
      />
    );
  }

  if (error instanceof HttpError) {
    if (error.status === 404) {
      return (
        <Status
          title="Not found"
          message="The page with given URL doesn't exist or is under construction"
          imageSrc={imagePaths.errors.notFoundError}
        />
      );
    }
    return (
      <Status
        title="Internal Server Error"
        message="Server returned incorrect response. Reload the page"
        imageSrc={imagePaths.errors.serverError}
        isRecoverable
      />
    );
  }

  if (error instanceof Error) {
    <Status
      title="App crashed"
      message={error.message}
      imageSrc={imagePaths.errors.appError}
      isRecoverable
    />;
  }

  return (
    <Status
      title="Unknown error"
      message="The app currently is not working"
      imageSrc={imagePaths.errors.unknownError}
      isRecoverable
    />
  );
};
