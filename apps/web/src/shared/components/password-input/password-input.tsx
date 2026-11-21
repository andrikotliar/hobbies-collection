import styles from './styles.module.css';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { TextInput } from '../text-input/text-input';

type InputTypeVariants = 'text' | 'password';

export const PasswordInput = (props: Omit<React.ComponentProps<typeof TextInput>, 'type'>) => {
  const [inputType, setInputType] = useState<InputTypeVariants>('password');

  const handleShowPassword = () => {
    setInputType((type) => {
      if (type === 'password') {
        return 'text';
      }

      return 'password';
    });
  };

  return (
    <TextInput
      ref={props.ref}
      type={inputType}
      icon={
        <button onClick={handleShowPassword} type="button" className={styles.show_password_button}>
          {inputType === 'password' ? (
            <EyeIcon className={styles.eye_icon} />
          ) : (
            <EyeOffIcon className={styles.eye_icon} />
          )}
        </button>
      }
      {...props}
    />
  );
};
