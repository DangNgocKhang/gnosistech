import { Link } from "react-router-dom";

const News = () => {
  return (
    <div className="w-full h-80 flex justify-center items-center bg-gnosis-primary-white py-14 border-y-2">
      <div className="w-11/12 lg:w-3/4 h-full flex flex-col gap-4">
        <h1 className="text-2xl">LATEST NEWS</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod .
        </p>
        <Link to="/blog">
          <span className="h-max w-max px-4 py-2 text-gnosis-primary-white font-medium bg-gnosis-primary-blue-th1 hover:cursor-pointer">
            OUR BLOG
          </span>
        </Link>
      </div>
    </div>
  );
};

export default News;
