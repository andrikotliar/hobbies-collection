export const LoginLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex items-center justify-center p-10 min-h-screen w-full">
      <div className="max-w-95 w-full shrink-0">{children}</div>
    </div>
  );
};
