// PrivateRoute.tsx
import React, { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { IUserCookie } from "../../types/User";
import { getGoogleLoginCookies } from "../auth/handleCookies";


interface PrivateRouteProps {
  element: ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component }) => {
  const user: IUserCookie | null = getGoogleLoginCookies();
  const location = useLocation();

  if (!user) {
    // Redirect to login page and pass the current path as state
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Component />;
};

export default PrivateRoute;
