import { assets } from "../../../assets/assets";

const Explore = () => {
  return (
    <div className="relative w-full h-[560px] flex justify-center items-center py-8 overflow-hidden ">
      <div className="absolute z-10">
        <div className=" text-gnosis-primary-white text-3xl md:text-5xl font-semibold text-center ">
          EXPLORE HOW TO BUILD THE OWN TRADING BOT
        </div>
        <button className="absolute left-1/2 -translate-x-1/2 h-max w-max bg-gnosis-primary-black text-center text-gnosis-primary-white mt-8 py-4 px-6 md:text-2xl text-xl font-semibold rounded-full">
          GET 15 DAYS FREE
        </button>
      </div>
      <img
        src={assets.content1}
        alt="content2"
        className="w-full h-full object-cover opacity-30"
        loading="lazy"
      />
    </div>
  );
};

export default Explore;
