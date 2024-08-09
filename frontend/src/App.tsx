import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "./components/PagesState/LoadingPage";
import PrivateRoute from "./utils/router/PrivateRoute";

// Lazy load components
const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./components/Home/Home"));
const AboutUs = lazy(() => import("./components/Aboutus/AboutUs"));
const ManageFile = lazy(() => import("./components/ManageFile/ManageFile"));
const UndevelopedPage = lazy(() => import("./components/PagesState/UndevelopedPage"));
const Login = lazy(() => import("./components/Login/Login"));
const Register = lazy(() => import("./components/Login/Register"));

const App = () => {
  return (
    <Provider store={store}>
      <div className="relative overflow-hidden">
        <Suspense fallback={<LoadingPage/>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="aboutus" element={<AboutUs />} />
              <Route path="register" element={<Register />} />
              <Route path="github" element={<UndevelopedPage />} />
              <Route path="file-storage" element={<PrivateRoute element={ManageFile} />} />
              <Route path="login" element={<Login />} />
              <Route path="signals" element={<UndevelopedPage />}>
                <Route path="stock-market" element={<UndevelopedPage />} />
                <Route path="trading-bot" element={<UndevelopedPage />} />
                <Route path="bot-portfolios" element={<UndevelopedPage />} />
              </Route>
              <Route path="traderhub" element={<UndevelopedPage />}>
                <Route path="gnosis-academy" element={<UndevelopedPage />} />
                <Route path="forum" element={<UndevelopedPage />} />
              </Route>
              <Route path="blog" element={<UndevelopedPage />}>
                <Route path="news" element={<UndevelopedPage />} />
                <Route path="knowledge-hub" element={<UndevelopedPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
        <ToastContainer autoClose={3000} />
      </div>
    </Provider>
  );
};

export default App;
