export const ContentWithSidebar = ({ children }: React.PropsWithChildren) => {
  return <div className="grid md:grid-cols-[300px_1fr] w-full gap-5">{children}</div>;
};
