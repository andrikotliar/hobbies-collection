export const LoginLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex items-center justify-center p-10 min-h-scree bg-slate-300 w-full">
      <div className="max-w-95 shrink-0">{children}</div>
    </div>
  );
};
