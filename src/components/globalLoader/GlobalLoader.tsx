import bgImage from '@/assets/images/main-bg.png';
export const GlobalLoader = () => {
  return (
    <div
      className="global-loader-container"
      style={{ ['--loader-bg' as any]: `url(${bgImage})` }}
    >
      <div className="global-loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
