export const ScrollableLine = ({ children }: React.PropsWithChildren) => {
  return <div className="flex gap-5 overflow-y-auto p-1">{children}</div>;
};
