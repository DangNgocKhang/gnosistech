import { Link } from "react-router-dom";
import { assets } from "../../../assets/assets";

const Introduce = () => {
  return (
    <div className="w-full h-[490px] flex justify-center items-center bg-gnosis-primary-blue-th2">
      <div className="w-11/12 lg:w-3/4 h-full  flex items-center">
        <div className="flex-1">
          <img
            src={assets.logoGnosis}
            alt="logo-gnosis-1"
            className=" w-3/4 h-auto"
            loading="lazy"
          />
        </div>

        <div className="flex-1 flex flex-col items-start gap-3">
          <span className="text-3xl font-semibold">ABOUT US</span>
          <p className="text-xm font-medium	">
            
          </p>
          <Link to="/aboutus">
            <div className="h-max w-max bg-gnosis-primary-black text-gnosis-primary-white text-lg font-semibold px-4 py-2 hover:cursor-pointer">
              LEARN MORE...
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
