import { FieldLabel } from '~/shared/components/field-label';
import { Image } from '~/shared/components/image/image';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { Trash2Icon, UploadIcon } from 'lucide-react';
import { Button } from '~/shared/components/button';
import { FieldError } from '~/shared/components/field-error';
import type { FormError } from '~/shared/types/form-error';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import { imagePaths } from '~/shared/configs/image-paths';
import clsx from 'clsx';

type Props = {
  label?: string;
  onChange: (file: File) => void;
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  accept?: string;
  defaultValue?: string | null;
  onRemove?: VoidFunction;
  error?: FormError;
};

export const FileInput = ({
  label,
  onChange,
  width = 250,
  height = 'auto',
  accept = '.jpg,.png,.jpeg,.svg,.webp',
  defaultValue = null,
  onRemove,
  error,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onChange(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    onRemove?.();
    setImagePreview(null);

    if (inputRef?.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!imagePreview) {
      setImagePreview(getExternalImageUrl(defaultValue));
    }
  }, [defaultValue]);

  return (
    <div className="relative flex flex-col gap-1" style={{ width }}>
      {label && <FieldLabel className={styles.label}>{label}</FieldLabel>}
      <div className={clsx('absolute -right-6', label ? 'top-6' : 'top-0')}>
        {imagePreview && (
          <Button icon={<Trash2Icon />} onClick={handleRemoveImage} variant="ghost" />
        )}
      </div>
      <label
        className="group relative flex rounded-lg overflow-hidden cursor-pointer aspect-9/14"
        style={{ height }}
      >
        <input
          type="file"
          onChange={handleChange}
          className="hidden"
          accept={accept}
          ref={inputRef}
        />
        <Image errorImageSrc={imagePaths.placeholders.imageNotFound} src={imagePreview} />
        <div className="absolute top-0 left-0 flex items-center justify-center bg-white/80 w-full h-full opacity-0 transition-opacity group-hover:opacity-100">
          <UploadIcon size="30%" className="text-gray-600" />
        </div>
      </label>
      <FieldError error={error} />
    </div>
  );
};
