import { useEffect, useState } from 'react';
import { VideoPreview } from './components/video-preview/video-preview';
import styles from './styles.module.css';
import { Button } from '~/shared/components/button';
import { Trash2Icon } from 'lucide-react';
import { FieldLabel } from '~/shared/components/field-label';
import { TextInput } from '~/shared/components/text-input/text-input';
import { getEmbeddableYoutubeUrl } from '~/shared/helpers/get-embeddable-youtube-url';
import type { RefCallBack } from 'react-hook-form';

type Props = {
  label?: string;
  error?: string | string[];
  externalWatchedValue?: string;
  onRemove?: VoidFunction;
  ref?: RefCallBack;
} & Omit<React.ComponentProps<typeof TextInput>, 'type' | 'label' | 'ref'>;

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
    <div className={styles.wrapper}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.container}>
        <VideoPreview imagePath={videoData.preview} videoUrl={videoData.value} />
        <div className={styles.tools}>
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
