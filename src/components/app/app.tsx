import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

const App: FC = () => (
  <div className={styles.app}>
    <Router>
      <AppHeader />
      <Routes>
        {/* Открытые маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Только для неавторизованных пользователей */}
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth component={<ResetPassword />} />}
        />

        {/* Только для авторизованных пользователей */}
        <Route
          path='/profile'
          element={<ProtectedRoute component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute component={<ProfileOrders />} />}
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </Router>
  </div>
);

export default App;
