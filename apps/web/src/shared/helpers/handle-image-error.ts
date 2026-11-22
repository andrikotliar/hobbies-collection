type HandleImageError = (imageSource: string) => React.ReactEventHandler<HTMLImageElement>;

export const handleImageError: HandleImageError = (imageSource) => {
  return (event) => {
    if (event.currentTarget.src?.includes('not-found')) {
      return;
    }
    event.currentTarget.src = imageSource;
  };
};
