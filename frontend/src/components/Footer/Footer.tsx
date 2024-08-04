import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="relative h-max w-full border-t-2">
      <div className="h-max w-full px-4 md:px-0 bg-gnosis-primary-white flex flex-col md:flex-row justify-evenly items-start py-6 gap-4">
        <div className="h-full flex-1 flex justify-center items-center">
          <Link to="/">
            <img
              src={assets.logoGnosis}
              alt="logo-gnosis-1"
              loading="lazy"
              className="w-28 h-auto "
            />
          </Link>
        </div>
        <div className="h-full flex-1 flex flex-col gap-2">
          <h4 className="font-bold">GNOSIS TECH </h4>
          <div className="w-8 border-2 border-gnosis-primary-blue-th1"></div>
          <ul>Gnosis tech – Transforming Traders into Scientist</ul>
          <ul>
            Address: 51/20, Le Van Mien Street, Thao Dien Ward, Dist 2,
            HCMC
          </ul>
          <ul>Email: Contact@gnosis-tech.com</ul> <ul>Phone: +84 946261269</ul>
        </div>
        <div className="h-full flex-1 flex flex-col gap-2">
          <h4 className="font-bold">OUR SITES </h4>
          <div className="w-8 border-2 border-gnosis-primary-blue-th1"></div>
          <ul>No categories</ul>
        </div>
        <div className="h-full flex-1 flex flex-col gap-2">
          <h4 className="font-bold">MOST POPULAR </h4>
          <div className="w-8 border-2 border-gnosis-primary-blue-th1"></div>
          <ul>No categories</ul>
        </div>
      </div>
      <div className="w-full h-16 bg-gradient-to-r from-gnosis-primary-blue-th1 to-gnosis-primary-blue-th2 flex">
        <span className="m-auto font-bold	">Copyright 2024 © Gnosis Tech</span>
      </div>
    </div>
  );
};

export default Footer;
