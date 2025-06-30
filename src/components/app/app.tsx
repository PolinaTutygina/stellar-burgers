import { FC, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserAuth } from '../../services/slices/user';
import { AppHeader } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { ProtectedRoute } from '@components';
import styles from './app.module.css';
import { RootState, AppDispatch } from '../../services/store';

const App: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isAuthChecked, isAuth } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  // Логирование для отладки состояния
  useEffect(() => {
    if (isAuthChecked) {
      console.log('Authentication status checked:', isAuth);
    }
  }, [isAuthChecked, isAuth]);

  if (!isAuthChecked) {
    return <div>Loading...</div>; // Пока данные загружаются, можно показать лоадер
  }

  return (
    <div className={styles.app}>
      <Router>
        <AppHeader />
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={<ProtectedRoute onlyUnAuth component={Login} />}
          />
          <Route
            path='/register'
            element={<ProtectedRoute onlyUnAuth component={Register} />}
          />
          <Route
            path='/forgot-password'
            element={<ProtectedRoute onlyUnAuth component={ForgotPassword} />}
          />
          <Route
            path='/reset-password'
            element={<ProtectedRoute onlyUnAuth component={ResetPassword} />}
          />
          <Route
            path='/profile'
            element={<ProtectedRoute component={Profile} />}
          />
          <Route
            path='/profile/orders'
            element={<ProtectedRoute component={ProfileOrders} />}
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
