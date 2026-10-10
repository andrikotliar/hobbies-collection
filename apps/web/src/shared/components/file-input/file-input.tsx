import { FieldLabel } from '~/shared/components/field-label/field-label';
import { Image } from '~/shared/components/image/image';
import { useEffect, useRef, useState } from 'react';
import styles from './file-input.module.css';
import { Trash2Icon, UploadIcon } from 'lucide-react';
import { Button } from '~/shared/components/button/button';
import { imagePaths, type FormError } from '~/shared';
import { FieldError } from '~/shared/components/field-error/field-error';

export type FileInputProps = {
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
}: FileInputProps) => {
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
      setImagePreview(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className={styles.root} style={{ width }}>
      {label && <FieldLabel className={styles.label}>{label}</FieldLabel>}
      <div className={styles.tools}>
        {imagePreview && (
          <Button icon={<Trash2Icon />} onClick={handleRemoveImage} variant="ghost" />
        )}
      </div>
      <label className={styles.input_wrapper} style={{ height }}>
        <input
          type="file"
          onChange={handleChange}
          className={styles.file_input}
          accept={accept}
          ref={inputRef}
        />
        <Image
          errorImageSrc={imagePaths.placeholders.imageNotFound}
          src={imagePreview}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <UploadIcon size="30%" className={styles.upload_icon} />
        </div>
      </label>
      <FieldError error={error} />
    </div>
  );
};
