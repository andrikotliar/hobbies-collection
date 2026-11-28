import type { FormError } from '~/shared/types/form-error';

type Props = {
  error?: FormError;
};

export const FieldError = ({ error }: Props) => {
  if (!error) {
    return null;
  }

  if (Array.isArray(error)) {
    return (
      <div className="flex flex-col gap-1">
        {error.map((message) => (
          <span className="text-red-400 text-xs">{message}</span>
        ))}
      </div>
    );
  }

  return (
    <div>
      <span className="text-red-400 text-xs">{error}</span>
    </div>
  );
};
