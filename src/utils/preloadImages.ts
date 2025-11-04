export const preloadImages = (sources: string[]) => {
  const promises = sources.map((src) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  });
  return Promise.all(promises);
};
