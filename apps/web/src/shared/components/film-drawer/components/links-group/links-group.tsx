import { DataLink } from '../data-link/data-link';
import { LinksGroupWrapper } from '../links-group-wrapper/links-group-wrapper';

type Props = {
  basePath: string;
  items: { id: number; title: string }[];
};

export const LinksGroup = ({ basePath, items }: Props) => {
  if (items.length === 0) {
    return <span>N/A</span>;
  }

  return (
    <LinksGroupWrapper>
      {items.map((item) => (
        <DataLink
          basePath="/"
          query={{
            [basePath]: [item.id],
          }}
          key={item.id}
        >
          {item.title}
        </DataLink>
      ))}
    </LinksGroupWrapper>
  );
};
