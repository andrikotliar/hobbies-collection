type Props<T extends Record<string, any>> = {
  data: T;
  component: (props: { data: T }) => React.ReactNode;
};

export const VisibleSection = <T extends Record<string, any>>({
  component: VisibleComponent,
  data,
}: Props<T>) => {
  if ((Array.isArray(data) && data.length === 0) || !data) {
    return null;
  }

  return <VisibleComponent data={data} />;
};
