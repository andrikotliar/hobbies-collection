import { useEffect, useState } from 'react';
import { Button } from '~/shared/components/controls/button';
import { PlayIcon, Trash2Icon } from 'lucide-react';
import { FieldLabel } from '~/shared/components/ui/field-label';
import { TextInput } from './text-input';
import { getEmbeddableYoutubeUrl } from '~/shared/helpers/get-embeddable-youtube-url';
import type { RefCallBack } from 'react-hook-form';
import { imagePaths } from '~/shared/configs/image-paths';
import { AppImage } from '~/shared/components/ui/app-image';
import clsx from 'clsx';

type Props = {
  label?: string;
  error?: string | string[];
  externalWatchedValue?: string;
  onRemove?: VoidFunction;
  ref?: RefCallBack;
} & Omit<React.ComponentProps<typeof TextInput>, 'type' | 'label' | 'ref'>;

const previewWrapperClassNames = clsx(
  'relative block overflow-hidden rounded-lg w-full sm:w-4/10 aspect-video shrink-0',
);

const VideoPreview = ({ imagePath, videoUrl }: { imagePath: string; videoUrl: string }) => {
  if (!videoUrl.length) {
    return (
      <div className={previewWrapperClassNames}>
        <AppImage src={imagePaths.placeholders.videoNotFound} />
      </div>
    );
  }

  return (
    <a
      className={previewWrapperClassNames}
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <AppImage src={imagePath} />
      <PlayIcon className="absolute top-1/2 left-1/2 text-white fill-white size-12.5 -translate-1/2" />
    </a>
  );
};

export const VideoInput = ({
  onBlur,
  externalWatchedValue,
  error,
  label,
  onRemove,
  ref,
  ...textInputProps
}: Props) => {
  const [videoData, setVideoData] = useState(getEmbeddableYoutubeUrl(externalWatchedValue ?? ''));
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    setInternalError('');
    onBlur?.(event);

    const value = event.target.value.trim();

    if (!value.length) {
      return;
    }

    const embeddableUrl = getEmbeddableYoutubeUrl(value);

    if (embeddableUrl.message) {
      setInternalError(embeddableUrl.message);
      return;
    }

    setVideoData(embeddableUrl);
  };

  useEffect(() => {
    if (typeof externalWatchedValue !== 'string' && videoData.value.length) {
      setVideoData({
        preview: '',
        value: '',
      });
    }
  }, [externalWatchedValue, videoData]);

  return (
    <div className="flex flex-col gap-2.5">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full">
        <VideoPreview imagePath={videoData.preview} videoUrl={videoData.value} />
        <div className="flex flex-col items-start gap-2.5 grow">
          <TextInput
            ref={ref}
            onBlur={handleBlur}
            error={internalError ?? error}
            {...textInputProps}
          />
          {onRemove && (
            <Button icon={<Trash2Icon />} variant="ghost" onClick={onRemove}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
