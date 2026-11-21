import { getFormattedDate } from '~/shared/helpers/get-formatted-date';
import { DataLink } from '../data-link/data-link';

type Props = {
  value: string | null;
};

export const ReleaseDate = ({ value }: Props) => {
  if (!value) {
    return 'N/A';
  }

  const formattedDate = getFormattedDate(value);

  const dateOnly = value.split('T')[0];

  return (
    <DataLink
      basePath="/"
      query={{
        startDate: dateOnly,
        endDate: dateOnly,
      }}
    >
      {formattedDate}
    </DataLink>
  );
};
