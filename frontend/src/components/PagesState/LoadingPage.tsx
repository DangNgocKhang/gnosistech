import { assets } from "../../assets/assets";

const LoadingPage = () => {
  return (
    <div className="h-screen w-screen bg-gnosis-primary-black flex z-50">
      <img
        src={assets.logoGnosis}
        alt="logo-gnosis-1"
        className="w-3/4 lg:w-auto h-auto lg:h-1/2 m-auto"
      />
    </div>
  );
};

export default LoadingPage;
