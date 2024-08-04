import { assets } from "../../../assets/assets";
import { receiveFromGnosistech } from "../../../templateData/dataHomepage";

const Insight = () => {
    const receiveFromGnosis = receiveFromGnosistech;

  return (
    <div className="w-full h-max flex justify-center items-center py-8">
        <div className="w-11/12 lg:w-3/4 flex flex-col justify-center items-center gap-4">
          <h1 className="text-gnosis-primary-blue-th1 text-xl md:text-5xl font-semibold py-8 text-center">
            COME TO GNOSIS, WHAT WILL YOU RECEIVE?
          </h1>
          <div className="bg-gnosis-primary-black w-full flex-1 grid grid-cols-1 md:grid-cols-3  gap-8">
            {receiveFromGnosis &&
              receiveFromGnosis.map((item, index) => {
                return (
                  <div
                    className=" h-max flex flex-col justify-between md:items-start items-center pb-8"
                    key={index}
                  >
                    <div className="h-max flex flex-col ">
                      <img
                        src={assets.content2}
                        alt="content2"
                        className="w-full h-auto object-contain"
                        loading="lazy"
                      />
                      <span className="h-max text-2xl font-medium text-center text-gnosis-primary-white mt-4 mb-8">
                        {item.title}
                      </span>
                      
                    </div>
                    <div className="flex flex-col gap-4 text-xm	text-gnosis-primary-white">
                      <ul className="list-disc list-outside ml-5">
                        {item.list_details.map((detail, index) => {
                          return <li className="mb-3" key={index}>{detail}</li>;
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
  )
};

export default Insight
