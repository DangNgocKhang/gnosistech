
// import Packages from "./components/Packages";

import Banner from "./components/Banner";
import Explore from "./components/Explore";
import Insight from "./components/Insight";
import Introduce from "./components/Introduce";


const Home = () => {
  return (
    <div className="h-max w-screen bg-gnosis-primary-black">
      <Banner />
      <Explore />
      <Insight />
      <Introduce />
      {/* <Packages /> */}
      {/* <Core />
      <News />
      <Faq /> */}
    </div>
  );
};

export default Home;
