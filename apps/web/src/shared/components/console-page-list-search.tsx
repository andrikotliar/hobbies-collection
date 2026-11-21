import { useLocation } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { TextInput } from '~/shared/components/text-input/text-input';
import { useDebouncedSearch } from '~/shared/hooks/use-debounced-search';

type Props = {
  onSearch: (value: string) => void;
};

export const ConsolePageListSearch = ({ onSearch }: Props) => {
  const location = useLocation();
  const handleSearch = useDebouncedSearch(onSearch);

  return (
    <TextInput
      defaultValue={location.search.q ?? ''}
      onChange={handleSearch}
      icon={<SearchIcon />}
      placeholder="Search..."
    />
  );
};
