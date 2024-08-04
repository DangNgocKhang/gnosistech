import { assets } from "../../assets/assets";

const AboutUs = () => {
  return (
    <div className="relative h-[calc(100vh-85px)] w-screen bg-gnosis-primary-black">
      <div className="h-1/2 w-full bg-gradient-to-t from-gnosis-primary-blue-th1 to-gnosis-primary-blue-th2 relative">
        <h1 className="absolute top-1/2 -translate-y-1/2 ml-8 text-7xl font-extrabold">OUR PARTNER</h1>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-10 w-16 overflow-hidden inline-block">
          <div className=" h-11 w-11 bg-gnosis-primary-blue-th1 -rotate-45 transform origin-top-left"></div>
        </div>
      </div>

      <div className="h-1/2 w-full flex justify-center items-center">
        <div className="w-11/12 lg:w-3/4 h-full flex flex-col text-gnosis-primary-white pt-8">
          <h4 className="text-3xl font-semibold">OUR PARTNER</h4>
          <p className="text-xl ">
            Create a friendly environment, build and develop together
          </p>
          <div className="flex-1 min-h-0 flex">
            <img
              src={assets.logoICLS}
              alt="logoICLS"
              className="h-full w-auto object-contain"
            />
            <img
              src={assets.logoYeager}
              alt="logoYeager"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
