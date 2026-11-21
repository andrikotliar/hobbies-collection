import { HttpError } from '@hobbies-collection/contracts';
import { onlineManager } from '@tanstack/react-query';
import { imagePaths } from '~/shared/configs/image-paths';
import { Status } from './components/status/status';

type Props = {
  error: unknown;
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
