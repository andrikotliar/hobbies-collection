export const ChartsGrid = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="grid gap-5 mt-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(500px,1fr))]">
      {children}
    </div>
  );
};
