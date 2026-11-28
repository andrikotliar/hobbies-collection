type Props = {
  title: string;
  children?: React.ReactNode;
};

export const FormGroup = ({ children, title }: Props) => {
  return (
    <div className="flex flex-col gap-2.5 pr-2.5">
      <div className="flex gap-2.5 items-center">
        <div className="font-bold uppercase">{title}</div>
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
};
