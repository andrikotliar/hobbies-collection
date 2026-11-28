import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { TextInput } from './text-input';

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
        <button onClick={handleShowPassword} type="button" className="flex hover:color-sky-600">
          {inputType === 'password' ? (
            <EyeIcon className="transition-colors" />
          ) : (
            <EyeOffIcon className="transition-colors" />
          )}
        </button>
      }
      {...props}
    />
  );
};
