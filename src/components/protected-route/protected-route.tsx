import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement, ElementType } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  component: ElementType; // Используем ElementType вместо ReactElement
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  component: Component // Переименуем `component` в `Component` для удобства
}) => {
  const location = useLocation();
  const { isAuth, isAuthChecked } = useSelector(
    (state: RootState) => state.user
  );

  if (!isAuthChecked) return null;

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Component />; // Рендерим переданный компонент
};
