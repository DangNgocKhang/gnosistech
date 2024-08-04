import { Outlet } from "react-router-dom";

const Signals = () => {
  return (
    <div className="h-[300px] w-full bg-gradient-to-t from-gnosis-primary-blue-th1 to-gnosis-primary-blue-th2 relative">
      <h4 className="absolute top-1/2 -translate-y-1/2 ml-8 text-7xl font-extrabold">
        SIGNALS
      </h4>
      <Outlet />

    </div>
  );
};

export default Signals;
