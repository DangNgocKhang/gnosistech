const Core = () => {
  return (
    <div className="w-full h-max flex justify-center items-center bg-gnosis-primary-blue-th2 py-14">
      <div className="w-11/12 lg:w-3/4 h-full  flex flex-col items-center ">
        <span className="text-3xl text-gnosis-primary-black mb-4">
          OUR CORE VALUE{" "}
        </span>
        <div className="w-3/4 md:w-full flex-1 flex flex-col md:flex-row justify-between gap-8">
          <div className=" w-full flex flex-col justify-center items-center gap-3">
            <div className="w-full aspect-square bg-gnosis-primary-blue-th1"></div>
            <h1>A title</h1>
            <h1 className="font-semibold">Image Box text</h1>
          </div>

          <div className=" w-full flex flex-col justify-center items-center gap-3">
            <div className="w-full aspect-square bg-gnosis-primary-blue-th1"></div>
            <h1>A title</h1>
            <h1 className="font-semibold">Image Box text</h1>
          </div>

          <div className=" w-full flex flex-col justify-center items-center gap-3">
            <div className="w-full aspect-square bg-gnosis-primary-blue-th1"></div>
            <h1>A title</h1>
            <h1 className="font-semibold">Image Box text</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Core;
