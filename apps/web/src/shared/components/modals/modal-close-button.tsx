import { XIcon } from 'lucide-react';

type Props = {
  onClick: VoidFunction;
};

export const ModalCloseButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center size-10 p-0 cursor-pointer absolute top-0 right-0 bg-white rounded-bl-lg"
    >
      <XIcon size={15} />
    </button>
  );
};
