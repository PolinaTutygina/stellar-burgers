import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  component: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  component
}) => {
  const location = useLocation();

  const isAuth = false; // TODO: заменить на данные из Redux
  const isAuthChecked = true; // TODO: заменить на isAuthChecked из Redux

  if (!isAuthChecked) return null;

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return component;
};
