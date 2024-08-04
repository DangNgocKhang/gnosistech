import { packagesInfo } from "../../../templateData/dataHomepage";

const Packages = () => {
  const listPackages = packagesInfo;
  return (
    <div className="w-full h-max flex justify-center items-center bg-gnosis-primary-black py-14">
      <div className="w-11/12 lg:w-3/4 h-full  flex flex-col items-center md:items-start">
        <span className="text-3xl text-gnosis-primary-white mb-4 ">HOME</span>
        <div className="w-3/4 md:w-full flex-1  flex flex-col md:flex-row justify-between gap-8 ">
          {listPackages &&
            listPackages.map((pack, index) => {
              return (
                <div
                  key={index}
                  className="h-max w-full bg-gnosis-primary-blue-th1 bg-opacity-80 flex-1 rounded-3xl text-center text-gnosis-primary-white p-1 pb-8 hover:cursor-pointer"
                >
                  <div className=" flex flex-col rounded-3xl overflow-hidden">
                    <div className="w-full h-max py-2  bg-gnosis-primary-black text-xl font-semibold ">
                      {pack.type}
                    </div>
                    <div className="text-4xl py-4 font-semibold">
                      {pack.price}
                    </div>
                    {pack.benefit.map((item) => {
                      return (
                        <>
                          <ul className="text-xl my-2">{item}</ul>
                          <hr className="w-3/5 self-center opacity-30" />
                        </>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Packages;
