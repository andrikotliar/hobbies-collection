import { PageTitle } from '~/shared/components/page-title/page-title';
import { getPluralWord } from '~/shared/helpers/get-plural-word';

type Props = {
  children?: React.ReactNode;
  total: number;
};

export const HobbyTitle = ({ children, total = 0 }: Props) => {
  return (
    <div className="flex flex-col gap-2.5 border-b border-b-slate-300 px-5 pt-2.5 pb-5 bg-white">
      <div className="flex items-center gap-5">
        <div>
          <PageTitle>{children}</PageTitle>
          <div>
            {total} {getPluralWord('item', total)}
          </div>
        </div>
      </div>
    </div>
  );
};
