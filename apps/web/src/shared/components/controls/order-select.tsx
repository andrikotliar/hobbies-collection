import { FieldLabel } from '~/shared/components/ui/field-label';
import { ScrollableLine } from '~/shared/components/layout/scrollable-line';
import { AppImage } from '~/shared/components/ui/app-image';
import clsx from 'clsx';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import type { MixedId } from '~/shared/types/mixed-id';
import { getVirtualChapterValue } from '~/shared/helpers/get-virtual-chapter-value';

type ListItem = {
  id: number;
  order: number | null;
  imagePath: string | null;
};

type Props = {
  label?: string;
  list: ListItem[];
  value: number;
  currentId?: MixedId;
  onChange: (value?: number) => void;
};

const itemClassNames = clsx(
  'block w-30 h-45 overflow-hidden rounded-lg has-[input:checked]:ring-5 has-[input:checked]:ring-amber-500',
);
const positionSelectClassNames = clsx(
  'text-xl flex items-center justify-center cursor-pointer bg-slate-100 [&>input]:hidden',
);

export const OrderSelect = ({
  label = 'Select position',
  list,
  value,
  currentId,
  onChange,
}: Props) => {
  const startingVirtualChapter = getVirtualChapterValue(0, list[0]?.order);

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{label}</FieldLabel>
      <ScrollableLine>
        {list.length === 0 && (
          <label className={clsx(itemClassNames, positionSelectClassNames)}>
            <input
              type="radio"
              onChange={() => onChange(startingVirtualChapter)}
              checked={value === startingVirtualChapter}
            />
          </label>
        )}
        {list.map((item, index) => {
          const virtualChapter = getVirtualChapterValue(item.order, list[index + 1]?.order);

          const isNextChapterSelected = list[index + 1]?.order === value;
          const isFirstChapterSelected = list[0].id === currentId;
          const isCurrentFilmSelected = item.id === currentId;

          return (
            <div key={item.id} className="flex gap-5">
              {index === 0 && !isFirstChapterSelected && (
                <label className={clsx(itemClassNames, positionSelectClassNames)}>
                  <input
                    type="radio"
                    onChange={() => onChange(startingVirtualChapter)}
                    checked={startingVirtualChapter === value}
                  />
                  <span>{index + 1}</span>
                </label>
              )}
              {isCurrentFilmSelected ? (
                <label className={clsx(itemClassNames, positionSelectClassNames)}>
                  <input
                    type="radio"
                    onChange={() => onChange(item.order ?? 0)}
                    checked={item.order === value}
                  />
                  <span>{item.order}</span>
                </label>
              ) : (
                <div className={itemClassNames}>
                  <AppImage src={getExternalImageUrl(item.imagePath)} />
                </div>
              )}
              {!isCurrentFilmSelected && !isNextChapterSelected && (
                <label className={clsx(itemClassNames, positionSelectClassNames)}>
                  <input
                    type="radio"
                    onChange={() => onChange(virtualChapter)}
                    checked={virtualChapter === value}
                  />
                  <span>{index + 2}</span>
                </label>
              )}
            </div>
          );
        })}
      </ScrollableLine>
    </div>
  );
};
