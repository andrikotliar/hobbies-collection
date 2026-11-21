import { EyeIcon, PencilIcon, PlusSquareIcon, Trash2Icon } from 'lucide-react';
import { Button } from '~/shared/components/button';
import type { DefaultListItem } from '~/shared/types/default-list-item';

type ActionHandler<T extends DefaultListItem> = (data: T) => void;

export type AdditionalHandler<T extends DefaultListItem> = {
  id: string;
  icon: React.ReactNode;
  action: (data: T) => void;
};

type Props<T extends DefaultListItem> = {
  data: T;
  titleKey?: keyof T;
  description?: (data: T) => string | null;
  onView?: ActionHandler<T>;
  onCreate?: ActionHandler<T>;
  onDelete: ActionHandler<T>;
  onEdit: ActionHandler<T>;
  additionalHandlers?: Array<AdditionalHandler<T>>;
};

export const ConsolePageListItemRow = <T extends DefaultListItem>({
  data,
  titleKey = 'title',
  description,
  onDelete,
  onEdit,
  onCreate,
  onView,
  additionalHandlers,
}: Props<T>) => {
  return (
    <div className="border-b border-b-slate-300 p-3.5 transition-colors first:rounded-t-lg last:border-0 last:rounded-b-lg hover:bg-slate-50">
      <div className="flex justify-between gap-4">
        <div>{data[titleKey]}</div>
        <div className="flex items-center justify-end gap-5">
          {typeof onView === 'function' && (
            <Button onClick={() => onView(data)} variant="ghost" icon={<EyeIcon />} />
          )}
          {typeof onCreate === 'function' && (
            <Button onClick={() => onCreate(data)} variant="ghost" icon={<PlusSquareIcon />} />
          )}
          <Button onClick={() => onEdit(data)} variant="ghost" icon={<PencilIcon />} />
          {additionalHandlers?.map((handler) => (
            <Button
              key={handler.id}
              onClick={() => handler.action(data)}
              variant="ghost"
              icon={handler.icon}
            />
          ))}
          <Button onClick={() => onDelete(data)} variant="ghost" icon={<Trash2Icon />} />
        </div>
      </div>
      {typeof description === 'function' && (
        <div className="text-xs text-gray-600 mt-1 empty:mt-0">{description(data)}</div>
      )}
    </div>
  );
};
